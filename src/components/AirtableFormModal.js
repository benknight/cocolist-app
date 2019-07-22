import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ModalCurtain, TextButton } from '@cocolist/thumbprint-react';
import { NavigationCloseSmall } from '@thumbtack/thumbprint-icons';
import styles from './AirtableFormModal.module.scss';

const AirtableFormModal = ({ formId, isOpen, onCloseClick, prefill }) => (
  <ModalCurtain stage={isOpen ? 'entered' : 'exited'} onCloseClick={onCloseClick}>
    {({ curtainClassName, curtainOnClick }) => (
      <div
        className={cx(curtainClassName, 'flex flex-column items-center justify-center')}
        onClick={curtainOnClick}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div
          className="relative bg-white w-100 h-100 s_h-auto center flex s_db flex-column s_br2 s_overflow-hidden"
          style={{ maxWidth: '600px' }}>
          <div className="s_absolute flex items-center justify-end top0 right0 bg-white pa3 bb b-gray-300 s_bn">
            <TextButton
              accessibilityLabel="Close modal"
              iconLeft={<NavigationCloseSmall />}
              onClick={onCloseClick}
              theme="inherit"
            />
          </div>
          <div className={cx(styles.iframeContainer, 'flex-auto')}>
            <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
            <iframe
              className="airtable-embed airtable-dynamic-height"
              src={`https://airtable.com/embed/${formId}?${prefill}`}
              frameBorder="0"
              width="100%"
              height="100%"
              title="Edit business"
            />
          </div>
        </div>
      </div>
    )}
  </ModalCurtain>
);

AirtableFormModal.propTypes = {
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  prefill: PropTypes.string,
};

export default AirtableFormModal;
