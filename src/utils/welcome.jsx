import { motion } from "framer-motion";

const Welcome = ({ name, language }) => {
  const greetings = {
    english: `Welcome to the website, ${name}!!`,
    spanish: `¡Bienvenido al sitio web, ${name}!!`,
    russian: `Добро пожаловать на сайт, ${name}!!`,
    armenian: `Բարի գալուստ, ${name}!!`,
    french: `Bienvenue sur le site, ${name}!!`,
    german: `Willkommen auf der Website, ${name}!!`,
    italian: `Benvenuto nel sito, ${name}!!`,
    chinese: `欢迎来到网站, ${name}!!`,
    japanese: `ウェブサイトへようこそ, ${name}!!`,
    korean: `웹 사이트에 오신 것을 환영합니다, ${name}!!`,
  };

  const text = greetings[language] ? greetings[language].split(" ") : [];

  return (
    <div className="modal">
      {text.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0,  }}
          animate={{ opacity: 1, }}
          transition={{
            duration: 2.5,
            delay: i * 0.1,
          }}
          style={{
            marginRight: "5px",
            fontSize: "30px",
            fontFamily: "Dancing Script, cursive",
          }}
        >
          {el}
        </motion.span>
      ))}
    </div>
  );
};

export default Welcome;
