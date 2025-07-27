"""
Internationalization utilities for Biotools API
"""

import gettext
import os
from typing import Optional
from functools import lru_cache

# 支持的语言
SUPPORTED_LANGUAGES = ['en', 'zh']
DEFAULT_LANGUAGE = 'en'

# 翻译对象缓存
_translations = {}

def get_locale_dir():
    """获取语言文件目录"""
    return os.path.join(os.path.dirname(__file__), 'locales')

@lru_cache(maxsize=None)
def get_translation(language: str = DEFAULT_LANGUAGE):
    """获取翻译对象"""
    if language not in SUPPORTED_LANGUAGES:
        language = DEFAULT_LANGUAGE
    
    if language not in _translations:
        try:
            translation = gettext.translation(
                'messages', 
                localedir=get_locale_dir(),
                languages=[language],
                fallback=True
            )
            _translations[language] = translation
        except FileNotFoundError:
            # 如果找不到翻译文件，使用默认翻译
            _translations[language] = gettext.NullTranslations()
    
    return _translations[language]

def _(message: str, language: str = DEFAULT_LANGUAGE) -> str:
    """翻译消息"""
    translation = get_translation(language)
    return translation.gettext(message)

def get_language_from_header(accept_language: Optional[str]) -> str:
    """从 Accept-Language 头部解析语言"""
    if not accept_language:
        return DEFAULT_LANGUAGE
    
    # 简单解析 Accept-Language 头部
    languages = []
    for lang_part in accept_language.split(','):
        lang = lang_part.strip().split(';')[0].strip()
        if lang.startswith('zh'):
            languages.append('zh')
        elif lang.startswith('en'):
            languages.append('en')
    
    # 返回第一个支持的语言
    for lang in languages:
        if lang in SUPPORTED_LANGUAGES:
            return lang
    
    return DEFAULT_LANGUAGE

# 预定义的消息常量
class Messages:
    """消息常量类"""
    
    # API 信息
    API_TITLE = "Biotools API"
    API_DESCRIPTION_EN = "Bioinformatics sequence processing toolkit API - supports single sequence and FASTA batch processing"
    API_DESCRIPTION_ZH = "生物序列处理工具套件 API - 支持单个序列和 FASTA 批量处理"
    
    # 通用消息
    SUCCESS = "Success"
    ERROR = "Error"
    INVALID_SEQUENCE = "Invalid sequence format"
    INVALID_SEQUENCE_TYPE = "Invalid sequence type"
    PROCESSING_ERROR = "Error processing sequence"
    FILE_UPLOAD_ERROR = "Error uploading file"
    
    # 序列类型
    DNA_SEQUENCE = "DNA sequence"
    RNA_SEQUENCE = "RNA sequence"
    PROTEIN_SEQUENCE = "Protein sequence"
    
    # 操作描述
    REVERSE_COMPLEMENT = "Reverse complement"
    TRANSCRIPTION = "Transcription"
    REVERSE_TRANSCRIPTION = "Reverse transcription"
    TRANSLATION = "Translation"
    UPPERCASE = "Convert to uppercase"
    LOWERCASE = "Convert to lowercase"
    SEQUENCE_STATS = "Sequence statistics"

def get_api_description(language: str = DEFAULT_LANGUAGE) -> str:
    """获取 API 描述"""
    if language == 'zh':
        return Messages.API_DESCRIPTION_ZH
    return Messages.API_DESCRIPTION_EN
