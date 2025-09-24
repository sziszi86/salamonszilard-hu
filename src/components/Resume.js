import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Resume = () => {
  const { t } = useLanguage();
  const [educationToggle, setEducationToggle] = useState(1);
  const [experienceToggle, setExperienceToggle] = useState(1);
  
  // Education data from language files
  const educationData = [
    {
      id: 1,
      title: "Frontend Webfejlesztő",
      academy: t('bkfTitle'),
      dec: t('bkfDesc'),
      startYear: "2005",
      endYear: "2007",
    },
  ];

  // Professional experience data from language files
  const experienceData = [
    {
      id: 1,
      title: t('freelancerTitle'),
      company: t('freelancer'),
      dec: t('freelancerDesc'),
      startYear: "2024",
      endYear: false,
    },
    {
      id: 2,
      title: t('gbSolutionsTitle'),
      company: t('gbSolutions'),
      dec: t('gbSolutionsDesc'),
      startYear: "2021",
      endYear: "2024",
    },
    {
      id: 3,
      title: t('easywayTitle'),
      company: t('easywaySystem'),
      dec: t('easywayDesc'),
      startYear: "2019",
      endYear: "2021",
    },
    {
      id: 4,
      title: t('adaptiveTitle'),
      company: t('adaptiveRecognition'),
      dec: t('adaptiveDesc'),
      startYear: "2014",
      endYear: "2019",
    },
    {
      id: 5,
      title: t('greenroomTitle'),
      company: t('greenroom'),
      dec: t('greenroomDesc'),
      startYear: "2010",
      endYear: "2014",
    },
    {
      id: 6,
      title: t('hinoraTitle'),
      company: t('hinoraGroup'),
      dec: t('hinoraDesc'),
      startYear: "2007",
      endYear: "2010",
    },
  ];

  return (
    <section className="lui-section lui-gradient-bottom" id="resume-section">
      {/* Heading */}
      <div className="lui-heading">
        <div className="container">
          <div className="m-titles align-center">
            <h2
              className="m-title splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span> {t('resume')} </span>
            </h2>
            <div
              className="m-subtitle splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span>
                {t('workExperience')} & {t('education')}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* History */}
      <div className="v-line v-line-left">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <h5
                className="history-title scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span> {t('education')} </span>
              </h5>
              <div className="history-items">
                {educationData.map((education, i) => (
                  <div
                    key={education.id}
                    className={`history-item lui-collapse-item scroll-animate ${
                      educationToggle === education.id ? "opened" : ""
                    }`}
                    data-animate="active"
                  >
                    <h6
                      className={`name lui-collapse-btn ${
                        educationToggle == education.id ? "active" : ""
                      }`}
                      onClick={() =>
                        setEducationToggle(
                          educationToggle == education.id ? null : education.id
                        )
                      }
                    >
                      <span> {education.academy} </span>
                    </h6>
                    <div className="history-content">
                      <div className="subname">
                        <span> {education.title} </span>
                      </div>
                      <div className="date lui-subtitle">
                        <span>
                          {t('bkfYears')}
                        </span>
                      </div>
                      <div className="text">
                        <div>
                          <p>{education.dec}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <h5
                className="history-title scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span> {t('workExperience')} </span>
              </h5>
              <div className="history-items">
                {experienceData.map((experience) => (
                  <div
                    className={`history-item lui-collapse-item scroll-animate ${
                      experience.id == experienceToggle ? "opened" : ""
                    }`}
                    data-animate="active"
                    key={experience.id}
                  >
                    <h6
                      className={`name lui-collapse-btn ${
                        experienceToggle == experience.id ? " active" : ""
                      }`}
                      onClick={() => setExperienceToggle(experience.id)}
                    >
                      <span> {experience.title} </span>
                    </h6>
                    <div className="history-content">
                      <div className="subname">
                        <span> {experience.company} </span>
                      </div>
                      <div className="date lui-subtitle">
                        <span>
                          {experience.startYear} -{" "}
                          {experience.endYear ? (
                            experience.endYear
                          ) : (
                            <b>{t('availableNow')}</b>
                          )}
                        </span>
                      </div>
                      <div className="text">
                        <div>
                          <p>{experience.dec}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lui-bgtitle">
            <span> {t('workExperience')} </span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Resume;