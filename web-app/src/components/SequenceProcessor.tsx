import React from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'conversion' | 'analysis';
  action: (sequence: string) => Promise<any>;
}

interface SequenceProcessorProps {
  sequence: string;
  result: string;
  loading: boolean;
  error: string;
  tools: Tool[];
  onSequenceChange: (sequence: string) => void;
  onToolAction: (tool: Tool) => void;
  onClearAll: () => void;
  onCopyResult: () => void;
}

const SequenceProcessor: React.FC<SequenceProcessorProps> = ({
  sequence,
  result,
  loading,
  error,
  tools,
  onSequenceChange,
  onToolAction,
  onClearAll,
  onCopyResult,
}) => {
  const toolsByCategory = {
    basic: tools.filter(tool => tool.category === 'basic'),
    conversion: tools.filter(tool => tool.category === 'conversion'),
    analysis: tools.filter(tool => tool.category === 'analysis'),
  };

  const categoryNames = {
    basic: '基础操作',
    conversion: '序列转换',
    analysis: '序列分析',
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <div className="tool-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">序列输入</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sequence-input" className="block text-sm font-medium text-gray-700 mb-2">
              输入生物序列 (DNA/RNA/蛋白质)
            </label>
            <textarea
              id="sequence-input"
              value={sequence}
              onChange={(e) => onSequenceChange(e.target.value)}
              placeholder="请输入您的生物序列，例如：ATCGATCGATCG"
              className="sequence-input"
              rows={4}
            />
            <p className="mt-2 text-sm text-gray-500">
              支持 DNA、RNA 和蛋白质序列。系统会自动检测序列类型。
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 工具按钮 */}
      <div className="tool-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">处理工具</h2>
        <div className="space-y-6">
          {Object.entries(toolsByCategory).map(([category, categoryTools]) => {
            if (categoryTools.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onToolAction(tool)}
                      disabled={loading || !sequence.trim()}
                      className="tool-button text-left p-3 h-auto"
                      title={tool.description}
                    >
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-blue-100 mt-1 opacity-90">
                        {tool.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            清空所有
          </button>
        </div>
      </div>

      {/* 结果区域 */}
      {(result || loading) && (
        <div className="tool-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">处理结果</h2>
            {result && (
              <button
                onClick={onCopyResult}
                className="px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                复制结果
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">处理中...</span>
            </div>
          ) : (
            <textarea
              value={result}
              readOnly
              className="sequence-output"
              rows={4}
              placeholder="处理结果将显示在这里"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SequenceProcessor;
