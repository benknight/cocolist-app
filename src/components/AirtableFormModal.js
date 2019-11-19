import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { LoaderDots, ModalCurtain, TextButton } from '@cocolist/thumbprint-react';
import { NavigationCloseMedium } from '@thumbtack/thumbprint-icons';
import styles from './AirtableFormModal.module.scss';

const AirtableFormModal = ({ formId, isOpen, onCloseClick, prefill }) => {
  const iframe = useRef(null);
  useEffect(() => {
    if (isOpen && iframe.current && iframe.current.getAttribute('data-src')) {
      iframe.current.setAttribute('src', iframe.current.getAttribute('data-src'));
      iframe.current.removeAttribute('data-src');
    }
  }, [isOpen]);
  return (
    <ModalCurtain stage={isOpen ? 'entered' : 'exited'} onCloseClick={onCloseClick}>
      {({ curtainClassName, curtainOnClick }) => (
        <div
          className={cx(curtainClassName, 'flex flex-column items-center justify-center')}
          onClick={curtainOnClick}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div
            className="relative bg-white w-100 h-100 s_h-auto center flex s_db flex-column s_br2 s_overflow-hidden"
            style={{ maxWidth: '600px' }}>
            <div className="s_absolute z-1 flex items-center justify-end top0 right0 pa2 bb b-gray-300 s_bn">
              <TextButton
                accessibilityLabel="Close modal"
                iconLeft={<NavigationCloseMedium />}
                onClick={onCloseClick}
                theme="inherit"
              />
            </div>
            <div
              className={cx(
                styles.iframeContainer,
                'relative flex-auto flex justify-center items-center',
              )}>
              <LoaderDots />
              <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
              <iframe
                className="airtable-embed airtable-dynamic-height absolute top0 left0 w-100 h-100"
                data-src={`https://airtable.com/embed/${formId}?${prefill || ''}`}
                frameBorder="0"
                width="100%"
                height="100%"
                ref={iframe}
                title="Edit business"
              />
            </div>
          </div>
        </div>
      )}
    </ModalCurtain>
  );
};

AirtableFormModal.propTypes = {
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  prefill: PropTypes.string,
};

export default AirtableFormModal;
