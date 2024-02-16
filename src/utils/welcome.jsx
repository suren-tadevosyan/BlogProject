import { motion } from "framer-motion";

const Welcome = ({ name, language }) => {
  const greetings = {
    english: `Welcome to the website,`,
    spanish: `¡Bienvenido al sitio web,`,
    russian: `Добро пожаловать на сайт,`,
    armenian: `Բարի գալուստ,`,
    french: `Bienvenue sur le site,`,
    german: `Willkommen auf der Website,`,
    italian: `Benvenuto nel sito,`,
    chinese: `欢迎来到网站,`,
    japanese: `ウェブサイトへようこそ,`,
    korean: `웹 사이트에 오신 것을 환영합니다,`,
  };

  const text = greetings[language] ? greetings[language].split(" ") : [];

  return (
    <div className="modal">
      {text.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2.5,
            delay: i * 0.1,
          }}
          style={{
            marginRight: "5px",
            fontSize: "30px",
            fontFamily: "Roboto, cursive",
            color: "#666666",
          }}
        >
          {el}
          {i === text.length - 1 && name && (
            <span style={{ color: " #ff6f61" }}> {name}</span>
          )}
        </motion.span>
      ))}
    </div>
  );
};

export default Welcome;
