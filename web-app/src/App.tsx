import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BiotoolsAPI, SequenceOutput, SequenceStats } from './services/api';
import SequenceProcessor from './components/SequenceProcessor';
import SequenceStatsDisplay from './components/SequenceStatsDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import './i18n';
import './index.css';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'conversion' | 'analysis';
  action: (sequence: string) => Promise<SequenceOutput | SequenceStats>;
}

const App: React.FC = () => {
  const { t } = useTranslation();
  const [sequence, setSequence] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [stats, setStats] = useState<SequenceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // 工具定义
  const tools: Tool[] = [
    {
      id: 'reverse-complement',
      name: t('tools.reverseComplement.name'),
      description: t('tools.reverseComplement.description'),
      category: 'conversion',
      action: (seq) => BiotoolsAPI.reverseComplement({ sequence: seq })
    },
    {
      id: 'transcribe',
      name: t('tools.transcribe.name'),
      description: t('tools.transcribe.description'),
      category: 'conversion',
      action: (seq) => BiotoolsAPI.transcribe({ sequence: seq })
    },
    {
      id: 'reverse-transcribe',
      name: t('tools.reverseTranscribe.name'),
      description: t('tools.reverseTranscribe.description'),
      category: 'conversion',
      action: (seq) => BiotoolsAPI.reverseTranscribe({ sequence: seq })
    },
    {
      id: 'translate',
      name: t('tools.translate.name'),
      description: t('tools.translate.description'),
      category: 'conversion',
      action: (seq) => BiotoolsAPI.translate({ sequence: seq })
    },
    {
      id: 'uppercase',
      name: t('tools.uppercase.name'),
      description: t('tools.uppercase.description'),
      category: 'basic',
      action: (seq) => BiotoolsAPI.toUppercase({ sequence: seq })
    },
    {
      id: 'lowercase',
      name: t('tools.lowercase.name'),
      description: t('tools.lowercase.description'),
      category: 'basic',
      action: (seq) => BiotoolsAPI.toLowercase({ sequence: seq })
    }
  ];

  // 检查 API 状态
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await BiotoolsAPI.healthCheck();
        setApiStatus('online');
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    // 每30秒检查一次API状态
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // 自动获取序列统计
  useEffect(() => {
    const getSequenceStats = async () => {
      if (sequence.trim() && apiStatus === 'online') {
        try {
          const statsResult = await BiotoolsAPI.getStats({ sequence });
          setStats(statsResult);
        } catch (error) {
          console.error('获取序列统计失败:', error);
        }
      } else {
        setStats(null);
      }
    };

    // 防抖处理
    const timeoutId = setTimeout(getSequenceStats, 500);
    return () => clearTimeout(timeoutId);
  }, [sequence, apiStatus]);

  const handleToolAction = async (tool: Tool) => {
    if (!sequence.trim()) {
      setError('请输入序列');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await tool.action(sequence);
      
      if ('result' in response) {
        // 序列处理结果
        setResult(response.result);
      } else {
        // 统计结果
        setStats(response);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || '处理失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSequence('');
    setResult('');
    setStats(null);
    setError('');
  };

  const handleCopyResult = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        // 可以添加一个临时的成功提示
      } catch (error) {
        console.error('复制失败:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header apiStatus={apiStatus} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 序列处理器 */}
          <SequenceProcessor
            sequence={sequence}
            result={result}
            loading={loading}
            error={error}
            tools={tools}
            onSequenceChange={setSequence}
            onToolAction={handleToolAction}
            onClearAll={handleClearAll}
            onCopyResult={handleCopyResult}
          />

          {/* 序列统计 */}
          {stats && (
            <div className="mt-8">
              <SequenceStatsDisplay stats={stats} />
            </div>
          )}

          {/* API 离线提示 */}
          {apiStatus === 'offline' && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    API 服务离线
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>无法连接到后端服务，请检查服务是否正常运行。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
