import styles from './footer.module.scss';

const footerLinks = {
  Product: ['Features', 'How It Works', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'API Reference', 'Support', 'Community'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'],
};

export default function Footer() {
  const handleNavClick = (e, label) => {
    e.preventDefault();
    const sectionMap = {
      'Features': '#features',
      'How It Works': '#how-it-works',
      'Pricing': '#pricing',
    };
    const href = sectionMap[label];
    if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>{'<>'}</span>
            <span className={styles.logoText}>NexCode</span>
            <p className={styles.tagline}>Code together, ship faster.</p>
          </div>

          <div className={styles.links}>
            {Object.entries(footerLinks).map(([category, items]) => (
              <div key={category} className={styles.linkGroup}>
                <h4>{category}</h4>
                {items.map((item) => (
                  <a 
                    key={item} 
                    href="#"
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2024 NexCode. All rights reserved.</span>
          <div className={styles.social}>
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}