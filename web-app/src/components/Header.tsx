import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  apiStatus: 'checking' | 'online' | 'offline';
}

const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  const { t } = useTranslation();
  
  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online':
        return t('status.apiOnline');
      case 'offline':
        return t('status.apiOffline');
      case 'checking':
        return t('status.checking');
      default:
        return t('status.error');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
                <p className="text-sm text-gray-500">{t('app.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* API 状态指示器 */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm text-gray-600">
                API {getStatusText()}
              </span>
            </div>

            {/* 导航链接 */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="https://github.com/luxiangze/Biotools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                GitHub
              </a>
            </nav>
            
            {/* 语言切换器 */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
