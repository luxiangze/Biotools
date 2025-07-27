"""
Biotools Backend API
Internationalized bioinformatics sequence processing backend service
Supports single sequence and FASTA batch processing
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Union
import re
import io
from Bio.Seq import Seq
from Bio.SeqUtils import molecular_weight
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from Bio import SeqIO
from Bio.SeqRecord import SeqRecord
import uvicorn
from i18n import _, get_language_from_header, get_api_description

# 创建 FastAPI 应用
app = FastAPI(
    title="Biotools API",
    description=get_api_description('en'),  # Default to English, will be dynamic in routes
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class SequenceInput(BaseModel):
    sequence: str = Field(..., description="Input biological sequence")
    sequence_type: Optional[str] = Field("auto", description="Sequence type: dna, rna, protein, auto")
    sequence_id: Optional[str] = Field(None, description="Sequence identifier")

class FastaInput(BaseModel):
    fasta_content: str = Field(..., description="FASTA format sequence content")
    sequence_type: Optional[str] = Field("auto", description="Sequence type: dna, rna, protein, auto")

class SequenceOutput(BaseModel):
    result: str = Field(..., description="Processing result")
    original_sequence: str = Field(..., description="Original sequence")
    sequence_type: str = Field(..., description="检测到的序列类型")
    sequence_id: Optional[str] = Field(None, description="序列标识符")
    metadata: Optional[Dict[str, Any]] = Field(None, description="额外的元数据信息")

class BatchSequenceOutput(BaseModel):
    results: List[SequenceOutput] = Field(..., description="批量处理结果")
    total_count: int = Field(..., description="总序列数量")
    success_count: int = Field(..., description="成功处理数量")
    error_count: int = Field(..., description="错误数量")
    errors: List[Dict[str, str]] = Field(default_factory=list, description="错误详情")

class SequenceStats(BaseModel):
    length: int
    composition: Dict[str, int]
    gc_content: Optional[float] = None
    molecular_weight: Optional[float] = None
    sequence_type: str
    sequence_id: Optional[str] = None

class BatchSequenceStats(BaseModel):
    results: List[SequenceStats] = Field(..., description="批量统计结果")
    total_count: int = Field(..., description="总序列数量")
    success_count: int = Field(..., description="成功处理数量")
    error_count: int = Field(..., description="错误数量")
    errors: List[Dict[str, str]] = Field(default_factory=list, description="错误详情")

# 工具函数
def detect_sequence_type(sequence: str) -> str:
    """自动检测序列类型"""
    clean_seq = re.sub(r'[^A-Za-z]', '', sequence.upper())
    
    if not clean_seq:
        return "unknown"
    
    # 检查是否包含蛋白质特有的氨基酸
    protein_chars = set('EFHIKLMNPQRSVWY')
    if any(char in protein_chars for char in clean_seq):
        return "protein"
    
    # 检查是否包含 U (RNA)
    if 'U' in clean_seq and 'T' not in clean_seq:
        return "rna"
    
    # 检查是否包含 T (DNA)
    if 'T' in clean_seq and 'U' not in clean_seq:
        return "dna"
    
    # 只包含 A, C, G 的情况，默认为 DNA
    if all(char in 'ACGT' for char in clean_seq):
        return "dna"
    
    return "unknown"

def validate_sequence(sequence: str, seq_type: str) -> bool:
    """验证序列格式"""
    clean_seq = re.sub(r'[^A-Za-z]', '', sequence.upper())
    
    if seq_type == "dna":
        return all(char in 'ATCG' for char in clean_seq)
    elif seq_type == "rna":
        return all(char in 'AUCG' for char in clean_seq)
    elif seq_type == "protein":
        return all(char in 'ACDEFGHIKLMNPQRSTVWY*' for char in clean_seq)
    
    return False

def clean_sequence(sequence: str) -> str:
    """清理序列，移除空格和非字母字符"""
    return re.sub(r'[^A-Za-z]', '', sequence.upper())

def parse_fasta_content(fasta_content: str) -> List[SeqRecord]:
    """解析 FASTA 格式内容"""
    try:
        fasta_io = io.StringIO(fasta_content)
        sequences = list(SeqIO.parse(fasta_io, "fasta"))
        return sequences
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"FASTA 格式解析错误: {str(e)}")

def process_single_sequence(sequence: str, seq_type: str, seq_id: Optional[str], 
                          operation: str) -> SequenceOutput:
    """处理单个序列的通用函数"""
    clean_seq = clean_sequence(sequence)
    
    if seq_type == "auto":
        seq_type = detect_sequence_type(clean_seq)
    
    try:
        bio_seq = Seq(clean_seq)
        
        if operation == "reverse_complement":
            if seq_type != "dna":
                raise ValueError("只支持 DNA 序列的反向互补操作")
            result = str(bio_seq.reverse_complement())
        elif operation == "transcribe":
            if seq_type != "dna":
                raise ValueError("只支持 DNA 序列的转录操作")
            result = str(bio_seq.transcribe())
            seq_type = "rna"
        elif operation == "reverse_transcribe":
            if seq_type != "rna":
                raise ValueError("只支持 RNA 序列的反转录操作")
            result = str(bio_seq.back_transcribe())
            seq_type = "dna"
        elif operation == "translate":
            if seq_type not in ["dna", "rna"]:
                raise ValueError("只支持 DNA 或 RNA 序列的翻译操作")
            result = str(bio_seq.translate())
            seq_type = "protein"
        elif operation == "uppercase":
            result = sequence.upper()
        elif operation == "lowercase":
            result = sequence.lower()
        else:
            raise ValueError(f"不支持的操作: {operation}")
        
        return SequenceOutput(
            result=result,
            original_sequence=sequence,
            sequence_type=seq_type,
            sequence_id=seq_id
        )
    except Exception as e:
        raise ValueError(str(e))

def calculate_sequence_stats(sequence: str, seq_type: str, seq_id: Optional[str]) -> SequenceStats:
    """计算序列统计信息"""
    clean_seq = clean_sequence(sequence)
    
    if seq_type == "auto":
        seq_type = detect_sequence_type(clean_seq)
    
    # 计算碱基/氨基酸组成
    composition = {}
    for char in set(clean_seq):
        composition[char] = clean_seq.count(char)
    
    stats = SequenceStats(
        length=len(clean_seq),
        composition=composition,
        sequence_type=seq_type,
        sequence_id=seq_id
    )
    
    # 计算 GC 含量 (仅对 DNA/RNA)
    if seq_type in ["dna", "rna"]:
        try:
            bio_seq = Seq(clean_seq)
            # 手动计算 GC 含量
            gc_count = clean_seq.count('G') + clean_seq.count('C')
            total_count = len(clean_seq)
            if total_count > 0:
                stats.gc_content = round((gc_count / total_count) * 100, 2)
            stats.molecular_weight = round(molecular_weight(bio_seq), 2)
        except:
            pass
    
    # 计算蛋白质分子量
    elif seq_type == "protein":
        try:
            protein_analysis = ProteinAnalysis(clean_seq)
            stats.molecular_weight = round(protein_analysis.molecular_weight(), 2)
        except:
            pass
    
    return stats

# API 路由
@app.get("/")
async def root():
    """根路径，返回 API 信息"""
    return {
        "message": "Biotools API",
        "version": "1.0.0",
        "docs": "/docs",
        "features": ["single_sequence", "batch_fasta", "pixi_managed"]
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "package_manager": "pixi"}

# 单个序列处理 API
@app.post("/sequence/reverse-complement", response_model=SequenceOutput)
async def reverse_complement(input_data: SequenceInput):
    """DNA 序列反向互补"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "reverse_complement"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/transcribe", response_model=SequenceOutput)
async def transcribe_dna_to_rna(input_data: SequenceInput):
    """DNA 转录为 RNA (T→U)"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "transcribe"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/reverse-transcribe", response_model=SequenceOutput)
async def reverse_transcribe_rna_to_dna(input_data: SequenceInput):
    """RNA 反转录为 DNA (U→T)"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "reverse_transcribe"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/translate", response_model=SequenceOutput)
async def translate_sequence(input_data: SequenceInput):
    """翻译 DNA/RNA 序列为蛋白质"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "translate"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/case/upper", response_model=SequenceOutput)
async def to_uppercase(input_data: SequenceInput):
    """转换为大写"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "uppercase"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/case/lower", response_model=SequenceOutput)
async def to_lowercase(input_data: SequenceInput):
    """转换为小写"""
    try:
        return process_single_sequence(
            input_data.sequence, 
            input_data.sequence_type or "auto",
            input_data.sequence_id,
            "lowercase"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理序列时出错: {str(e)}")

@app.post("/sequence/stats", response_model=SequenceStats)
async def get_sequence_stats(input_data: SequenceInput):
    """获取序列统计信息"""
    try:
        return calculate_sequence_stats(
            input_data.sequence,
            input_data.sequence_type or "auto",
            input_data.sequence_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"计算统计信息时出错: {str(e)}")

# FASTA 批量处理 API
@app.post("/fasta/reverse-complement", response_model=BatchSequenceOutput)
async def batch_reverse_complement(input_data: FastaInput):
    """批量 DNA 序列反向互补"""
    sequences = parse_fasta_content(input_data.fasta_content)
    results = []
    errors = []
    
    for seq_record in sequences:
        try:
            result = process_single_sequence(
                str(seq_record.seq),
                input_data.sequence_type or "auto",
                seq_record.id,
                "reverse_complement"
            )
            results.append(result)
        except Exception as e:
            errors.append({
                "sequence_id": seq_record.id,
                "error": str(e)
            })
    
    return BatchSequenceOutput(
        results=results,
        total_count=len(sequences),
        success_count=len(results),
        error_count=len(errors),
        errors=errors
    )

@app.post("/fasta/transcribe", response_model=BatchSequenceOutput)
async def batch_transcribe(input_data: FastaInput):
    """批量 DNA 转录为 RNA"""
    sequences = parse_fasta_content(input_data.fasta_content)
    results = []
    errors = []
    
    for seq_record in sequences:
        try:
            result = process_single_sequence(
                str(seq_record.seq),
                input_data.sequence_type or "auto",
                seq_record.id,
                "transcribe"
            )
            results.append(result)
        except Exception as e:
            errors.append({
                "sequence_id": seq_record.id,
                "error": str(e)
            })
    
    return BatchSequenceOutput(
        results=results,
        total_count=len(sequences),
        success_count=len(results),
        error_count=len(errors),
        errors=errors
    )

@app.post("/fasta/translate", response_model=BatchSequenceOutput)
async def batch_translate(input_data: FastaInput):
    """批量翻译 DNA/RNA 序列为蛋白质"""
    sequences = parse_fasta_content(input_data.fasta_content)
    results = []
    errors = []
    
    for seq_record in sequences:
        try:
            result = process_single_sequence(
                str(seq_record.seq),
                input_data.sequence_type or "auto",
                seq_record.id,
                "translate"
            )
            results.append(result)
        except Exception as e:
            errors.append({
                "sequence_id": seq_record.id,
                "error": str(e)
            })
    
    return BatchSequenceOutput(
        results=results,
        total_count=len(sequences),
        success_count=len(results),
        error_count=len(errors),
        errors=errors
    )

@app.post("/fasta/stats", response_model=BatchSequenceStats)
async def batch_sequence_stats(input_data: FastaInput):
    """批量获取序列统计信息"""
    sequences = parse_fasta_content(input_data.fasta_content)
    results = []
    errors = []
    
    for seq_record in sequences:
        try:
            stats = calculate_sequence_stats(
                str(seq_record.seq),
                input_data.sequence_type or "auto",
                seq_record.id
            )
            results.append(stats)
        except Exception as e:
            errors.append({
                "sequence_id": seq_record.id,
                "error": str(e)
            })
    
    return BatchSequenceStats(
        results=results,
        total_count=len(sequences),
        success_count=len(results),
        error_count=len(errors),
        errors=errors
    )

# 文件上传 API
@app.post("/fasta/upload/reverse-complement", response_model=BatchSequenceOutput)
async def upload_fasta_reverse_complement(file: UploadFile = File(...)):
    """上传 FASTA 文件进行批量反向互补"""
    if not file.filename.endswith(('.fasta', '.fa', '.fas')):
        raise HTTPException(status_code=400, detail="只支持 .fasta, .fa, .fas 格式的文件")
    
    try:
        content = await file.read()
        fasta_content = content.decode('utf-8')
        
        input_data = FastaInput(fasta_content=fasta_content)
        return await batch_reverse_complement(input_data)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="文件编码错误，请使用 UTF-8 编码")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理文件时出错: {str(e)}")

@app.post("/fasta/upload/stats", response_model=BatchSequenceStats)
async def upload_fasta_stats(file: UploadFile = File(...)):
    """上传 FASTA 文件进行批量统计分析"""
    if not file.filename.endswith(('.fasta', '.fa', '.fas')):
        raise HTTPException(status_code=400, detail="只支持 .fasta, .fa, .fas 格式的文件")
    
    try:
        content = await file.read()
        fasta_content = content.decode('utf-8')
        
        input_data = FastaInput(fasta_content=fasta_content)
        return await batch_sequence_stats(input_data)
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="文件编码错误，请使用 UTF-8 编码")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理文件时出错: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
