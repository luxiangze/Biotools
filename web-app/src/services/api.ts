import axios from 'axios';

// API 基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// 数据类型定义
export interface SequenceInput {
  sequence: string;
  sequence_type?: 'dna' | 'rna' | 'protein' | 'auto';
}

export interface SequenceOutput {
  result: string;
  original_sequence: string;
  sequence_type: string;
  metadata?: Record<string, any>;
}

export interface SequenceStats {
  length: number;
  composition: Record<string, number>;
  gc_content?: number;
  molecular_weight?: number;
  sequence_type: string;
}

// API 服务类
export class BiotoolsAPI {
  // 健康检查
  static async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  // 反向互补
  static async reverseComplement(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/reverse-complement', input);
    return response.data;
  }

  // DNA 转录为 RNA
  static async transcribe(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/transcribe', input);
    return response.data;
  }

  // RNA 反转录为 DNA
  static async reverseTranscribe(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/reverse-transcribe', input);
    return response.data;
  }

  // 翻译序列
  static async translate(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/translate', input);
    return response.data;
  }

  // 转换为大写
  static async toUppercase(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/case/upper', input);
    return response.data;
  }

  // 转换为小写
  static async toLowercase(input: SequenceInput): Promise<SequenceOutput> {
    const response = await apiClient.post('/sequence/case/lower', input);
    return response.data;
  }

  // 获取序列统计
  static async getStats(input: SequenceInput): Promise<SequenceStats> {
    const response = await apiClient.post('/sequence/stats', input);
    return response.data;
  }
}

export default BiotoolsAPI;
