import { motion } from 'framer-motion'
import styles from './RulesPage.module.css'
import {ROUTES} from '../../utils/constants.js'

const RulesPage = () => {
  return (
    <div className={styles.rulesPage}>
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <span>Правила</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>
            Правила аренды <span className={styles.accent}>KYCAKA RENT</span>
          </h1>
          <p className={styles.subtitle}>
            Внимательно ознакомьтесь с правилами перед арендой аккаунта
          </p>
        </motion.div>

        <div className={styles.rulesContainer}>
          {/* Шаг 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.ruleCard}
          >
            <div className={styles.stepNumber}>1️⃣</div>
            <div className={styles.ruleContent}>
              <h3 className={styles.ruleTitle}>Создание заявки</h3>
              <p className={styles.ruleText}>
                Создаете заявку на аренду аккаунта, указывая все предложенные при создании пункты
              </p>
            </div>
          </motion.div>

          {/* Шаг 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.ruleCard}
          >
            <div className={styles.stepNumber}>2️⃣</div>
            <div className={styles.ruleContent}>
              <h3 className={styles.ruleTitle}>Оплата и проверка</h3>
              <p className={styles.ruleText}>
                Оплачиваете аренду на реквизиты, которые будут указаны (их будет несколько).
                После оплаты, ваша заявка уходит на проверку админу, после успешной проверки, 
                вам напишут в указанную вами соц сеть для проверки на вредоносное ПО.
              </p>
              <div className={styles.warning}>
                После перевода, возврат средств не предусмотрен. Если по каким-либо причинам 
                вы не смогли провести оплаченное время на аккаунте, пишите админу в телеграм @praemanager
              </div>
            </div>
          </motion.div>

          {/* Шаг 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.ruleCard}
          >
            <div className={styles.stepNumber}>3️⃣</div>
            <div className={styles.ruleContent}>
              <h3 className={styles.ruleTitle}>Вход в аккаунт</h3>
              <p className={styles.ruleText}>
                Перед выдачей происходит проверка на читы/постороннее ПО через звонок в выбранной 
                вами соц сети по демонстрации экрана.
              </p>
              <div className={styles.note}>
                «Не бойтесь, ничего страшного не произойдет, в среднем она длится 5 минут с учетом самого входа»
              </div>
              <div className={styles.important}>
                Вот сейчас настанет момент Х, поэтому пожалуйста позаботьтесь об управлении/чувствительности 
                заранее перед входом на аккаунт, ибо повторный вход не предусмотрен
              </div>
            </div>
          </motion.div>

          {/* Шаг 4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.ruleCard}
          >
            <div className={styles.stepNumber}>4️⃣</div>
            <div className={styles.ruleContent}>
              <h3 className={styles.ruleTitle}>Запуск на аккаунте</h3>
              <p className={styles.ruleText}>
                «Ура, если вы дошли до этого пункта, все прошло успешно, вы прошли легкую недолгую 
                проверку и теперь с самого начала входа начинается отсчет вашего времени, по истечению 
                которого вы должны предоставить мне запись выхода с аккаунта»
              </p>
            </div>
          </motion.div>

          {/* Преимущества */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={styles.benefitsCard}
          >
            <div className={styles.benefitsContent}>
              <h3 className={styles.benefitsTitle}>У меня лояльная аренда</h3>
              <p className={styles.benefitsText}>
                Я стараюсь относиться к вам с максимальным пониманием и отличаться от всех аренд 
                у кого вы могли брать, поэтому у меня вы можете:
              </p>
              <ul className={styles.benefitsList}>
                <li>Перенести свои часы аренды (при предварительном уведомлении)</li>
                <li>Заменить аккаунт на другой (при доплате за перевход в 100₽)</li>
              </ul>
            </div>
          </motion.div>

          {/* Правила и запреты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={styles.warningSection}
          >
            <h2 className={styles.warningTitle}>
              Правила <span className={styles.accent}>KYCAKA RENT</span> ❕
            </h2>
            <p className={styles.warningIntro}>
              А теперь стоит поговорить о плохом так как мир не без плохих людей и очень многие 
              пользуются чужой добротой, вынужден принимать ответные меры.
            </p>
            
            <div className={styles.legalNotice}>
              Если вы оплатили аренду, вы автоматом согласились со всеми правилами. 
              Я имею за собой право изменять правила в свою пользу при обнаружении изъянов и 
              последующим вами использованием недочетов и моей не бдительности в свою выгоду
            </div>

            <div className={styles.penalty}>
              При обнаружении на проверке софта, читов, подозрительных программ, 
              отказ в сдаче аренды без возврата денежных средств.
            </div>

            <div className={styles.prohibitedSection}>
              <h3 className={styles.prohibitedTitle}>ЗАПРЕЩАЕТСЯ</h3>
              <ul className={styles.prohibitedList}>
                <li>Самостоятельно донатить на аккаунт</li>
                <li>Самовольно менять ник</li>
                <li>Тратить UC (закинуть юц на акк можно через меня)</li>
                <li>Тратить материалы</li>
                <li>Трогать любые настройки кроме игровых</li>
                <li>Удалять друзей</li>
                <li>Пати с читером</li>
                <li>Снижать репутацию даже на единицу</li>
                <li>Бан микрофона</li>
                <li>Любые действия запрещенные игрой</li>
              </ul>
            </div>

            <div className={styles.banReason}>
              <strong>Я выкину вас с аккаунта если:</strong> Вы очистили со мной диалог
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default RulesPage