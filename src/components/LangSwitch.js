import cx from 'classnames';
import { navigate } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { getLocalizedURL } from '../lib/common/i18n';
import useLocalStorage from '../lib/useLocalStorage';
import styles from './LangSwitch.module.scss';

export default function LangSwitch({ lang, location, truncate }) {
  const [, setLangSelection] = useLocalStorage('langSelection');
  const { formatMessage } = useIntl();
  return (
    <div
      className="relative tp-link tp-title-4"
      title={formatMessage({ id: 'toggle_language' })}>
      <svg className="db" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M12.65 15.67c.14-.36.05-.77-.23-1.05l-2.09-2.06.03-.03c1.74-1.94 2.98-4.17 3.71-6.53h1.94c.54 0 .99-.45.99-.99v-.02c0-.54-.45-.99-.99-.99H10V3c0-.55-.45-1-1-1s-1 .45-1 1v1H1.99c-.54 0-.99.45-.99.99 0 .55.45.99.99.99h10.18C11.5 7.92 10.44 9.75 9 11.35c-.81-.89-1.49-1.86-2.06-2.88-.16-.29-.45-.47-.78-.47-.69 0-1.13.75-.79 1.35.63 1.13 1.4 2.21 2.3 3.21L3.3 16.87c-.4.39-.4 1.03 0 1.42.39.39 1.02.39 1.42 0L9 14l2.02 2.02c.51.51 1.38.32 1.63-.35zM17.5 10c-.6 0-1.14.37-1.35.94l-3.67 9.8c-.24.61.22 1.26.87 1.26.39 0 .74-.24.88-.61l.89-2.39h4.75l.9 2.39c.14.36.49.61.88.61.65 0 1.11-.65.88-1.26l-3.67-9.8c-.22-.57-.76-.94-1.36-.94zm-1.62 7l1.62-4.33L19.12 17h-3.24z" />
      </svg>
      <select
        className={cx('absolute top-0 right-0 w-100 h-100', styles.select)}
        onChange={event => {
          setLangSelection(event.target.value);
          navigate(getLocalizedURL(location.pathname, event.target.value));
        }}
        value={lang}>
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="km">ភាសាខ្មែរ</option>
      </select>
    </div>
  );
}
