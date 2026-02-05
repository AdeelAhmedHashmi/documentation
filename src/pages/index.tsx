import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const features = [
  {
    title: 'Api Reference',
    description: 'Comprehensive documentation of all backend API endpoints.',
    link: '/docs/apis',
  },
  {
    title: 'Guide and Tutorials',
    description: 'Guide for connecting, querying, and managing your database.',
    link: '/docs/category/guide',
  },
  {
    title: 'Database Schemas',
    description: 'Documentation of all database schemas.',
    link: '/docs/Schemas/User/user-schema',
  }
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
   <div className={styles.heroContainer}>
      <header className={clsx('hero', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            {siteConfig.tagline || 'Your backend API documentation made simple.'}
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="docs/Overview">
              Get Started
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((feature, idx) => (
                <div key={idx} className={clsx('col col--3', styles.feature)}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link className="button button--secondary" to={feature.link}>
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
