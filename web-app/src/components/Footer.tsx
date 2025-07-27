import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">{t('app.title')}</span>
            </div>
            <p className="text-gray-600 mb-4">
              {t('footer.brandDescription')}
            </p>
            <p className="text-sm text-gray-500">
              {t('footer.platformSupport')}
            </p>
          </div>

          {/* 功能特性 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.features')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.reverseComplement')}
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.transcriptionReverseTranscription')}
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.proteinTranslation')}
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.sequenceAnalysis')}
                </span>
              </li>
            </ul>
          </div>

          {/* 平台支持 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.platforms')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.webApp')}
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.raycastExtension')}
                </span>
              </li>
              <li>
                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  {t('footer.utoolsPlugin')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            {t('footer.copyright')}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <span className="sr-only">文档</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
