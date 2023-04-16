import React, {useEffect, useState} from "react";
import {Button, Paper, TextField, Typography} from "@mui/material";
import "../App.css";
import background from '../assets/background.png'
import {useNavigate} from "react-router-dom";
import "./styles.scss"


const Login = () => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('')
    const [errorLogin, setErrorLogin] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const navigate = useNavigate()



    const validationLogin = (input: string) => {
    const error = input.toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
      error === null ? setErrorLogin(true) : setErrorLogin(false);
    };

    const validationPassword = (input: string) => {
        const error = input.match(
                /[^а-яА-Я]{8,}$/
            );
       error === null?  setErrorPassword(true) : setErrorPassword(false)
    }

    return (
        <div className='loginContainer'>
            <img className='background' src={background}/>
            <div className='loginForm'>
                <Paper elevation={2} className='login'>
                    <h1 className='mainTitle'>
                        Simple Hotel Check
                    </h1>
                    <p className='loginTitle'>Логин</p>
                    <TextField
                        error={errorLogin}
                        id="outlined-controlled"
                        label=""
                        helperText={errorLogin? "проверьте почту" : ''}
                        value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                        onBlur={()=>validationLogin(name)}
                    />
                    <p className='loginTitle'>Пароль</p>
                    <TextField
                        error={errorPassword}
                        id="outlined-controlled"
                        label=""
                        helperText={errorPassword ? "Минимум 8 символов, не допускается кириллица" : ''}
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                        onBlur={()=>validationPassword(password)}
                    />
                    <button
                        className='loginButton'
                        disabled={name==='' || password===''}
                        onClick={() => {
                            validationLogin(name);
                            validationPassword(password);
                            if (!errorLogin && !errorPassword) {
                                const user = {
                                    userName: name,
                                    pass: password
                                };
                                localStorage.setItem('currentUser', JSON.stringify(user));
                                navigate("/hotels")
                            };
                        }}
                        >
                        Войти
                        </button>
                </Paper>

            </div>

        </div>
    )
}

export default Login