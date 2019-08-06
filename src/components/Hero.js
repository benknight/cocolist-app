import React from 'react';
import Img from 'gatsby-image';
import styles from './Hero.module.scss';

export default props => <Img {...props} className={styles.hero} />;
