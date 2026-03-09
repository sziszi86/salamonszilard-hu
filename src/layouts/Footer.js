import { useLanguage } from "../contexts/LanguageContext";
const Footer = () => {
  const { t } = useLanguage();
  return (
    <div className="footer">
      <div className="footer__builder">
        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div
                className="copyright-text align-center scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                © 2026 <strong>Salamon Szilárd</strong>. {t('allRightsReserved')}
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div
                className="copyright-text align-right scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
