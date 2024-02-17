import { SendAnimation } from "../../utils/successAnim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";

const MessageSend = ({ closeModal }) => {
  return (
    <div className="modalInner">
      <SendAnimation />
      <div>
        <h2>
          <p>Thank you for reaching out! Your message has been received. </p>
          <p>We'll get back to you as soon as possible.</p>
          <FontAwesomeIcon
            icon={faHandshake}
            className="handsClose"
            onClick={closeModal}
          />
        </h2>
      </div>
    </div>
  );
};

export default MessageSend;
