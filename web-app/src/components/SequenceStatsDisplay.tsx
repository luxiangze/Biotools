import React from 'react';
import { SequenceStats } from '../services/api';

interface SequenceStatsDisplayProps {
  stats: SequenceStats;
}

const SequenceStatsDisplay: React.FC<SequenceStatsDisplayProps> = ({ stats }) => {
  const getSequenceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dna':
        return 'bg-blue-100 text-blue-800';
      case 'rna':
        return 'bg-green-100 text-green-800';
      case 'protein':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSequenceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dna':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rna':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'protein':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // 计算组成百分比
  const totalBases = Object.values(stats.composition).reduce((sum, count) => sum + count, 0);
  const compositionPercentages = Object.entries(stats.composition).map(([base, count]) => ({
    base,
    count,
    percentage: totalBases > 0 ? ((count / totalBases) * 100).toFixed(1) : '0.0'
  }));

  return (
    <div className="tool-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">序列统计</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 序列类型 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            {getSequenceTypeIcon(stats.sequence_type)}
            <span className="text-sm font-medium text-gray-600">序列类型</span>
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSequenceTypeColor(stats.sequence_type)}`}>
            {stats.sequence_type.toUpperCase()}
          </div>
        </div>

        {/* 序列长度 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">长度</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.length}</div>
        </div>

        {/* GC 含量 */}
        {stats.gc_content !== undefined && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-gray-600">GC 含量</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.gc_content}%</div>
          </div>
        )}

        {/* 分子量 */}
        {stats.molecular_weight !== undefined && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
              </svg>
              <span className="text-sm font-medium text-gray-600">分子量</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {stats.molecular_weight.toLocaleString()} Da
            </div>
          </div>
        )}
      </div>

      {/* 组成分析 */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-3">组成分析</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {compositionPercentages
            .sort((a, b) => b.count - a.count)
            .map(({ base, count, percentage }) => (
              <div key={base} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">{base}</div>
                <div className="text-sm text-gray-600">{count}</div>
                <div className="text-xs text-gray-500">({percentage}%)</div>
              </div>
            ))}
        </div>
      </div>

      {/* 可视化条形图 */}
      {compositionPercentages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">组成分布</h3>
          <div className="space-y-2">
            {compositionPercentages
              .sort((a, b) => b.count - a.count)
              .map(({ base, count, percentage }) => (
                <div key={base} className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium text-gray-700">{base}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-primary-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {count} ({percentage}%)
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceStatsDisplay;
