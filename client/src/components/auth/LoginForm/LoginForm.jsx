import { useContext, useState } from "react"
import { Context } from "../../../main"
import { observer } from 'mobx-react-lite'

const LoginForm = observer(() => {
    let usId
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const {store} = useContext(Context)

    return (
        <div>
            <input 
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="text" 
            placeholder="Email"
            />

            <input 
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password" 
            placeholder="Password"
            />

            <input 
            onChange={e => setVerifyCode(e.target.value)}
            value={verifyCode}
            type="text" 
            placeholder="code"
            />
            <button onClick={() => store.login(email, password)}>Выслать код</button>
            <button onClick={() => store.verifyLogin(store.userId, verifyCode)}>Логин</button>
            <button onClick={() => store.registration(email, password)}>Регистрация</button>
            <button onClick={() => store.logout()}>Выход</button>
        </div>
    )
})

export default LoginForm