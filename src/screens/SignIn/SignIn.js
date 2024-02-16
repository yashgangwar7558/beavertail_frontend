import Logo from '../../assets/logo/logo.png';
import Background from '../../assets/background1.jpg';
import './SignIn.css'
import { useNavigate } from 'react-router'
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig'
import Spinner from 'react-native-loading-spinner-overlay';
import { Box, Button, IconButton, TextField, InputAdornment, StyledEngineProvider } from '@mui/material'
import { AccountCircleRounded, LockRounded, VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';

const SignIn = ({ navigation }) => {
    const navigate = useNavigate({});
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const { isLoading, login, error } = useContext(AuthContext);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    return (
        <div className='login-screen'>
            <div className='login-card'>
                <div>
                    <div className='logo-container'>
                        <img src={Logo} alt="logo" className='logo' />
                    </div>
                    <Box>
                        <Spinner visible={isLoading} />
                        <StyledEngineProvider injectFirst>
                            <div className='input-container' id='username'>
                                <TextField type="text" fullWidth placeholder='Username'
                                    name='username' value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    variant='standard'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <AccountCircleRounded />
                                            </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                    }}
                                />
                            </div>
                            <div className="input-container" id='password'>
                                <TextField type={showPassword ? 'text' : 'password'} fullWidth placeholder='Password'
                                    name='password' value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    variant='standard'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <LockRounded />
                                            </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end">
                                                    {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>

                            <div className='forgot-link'>
                                <p>Forgot password?</p>
                            </div>

                            {error ? (
                                <p className='error-msg'>{error}</p>
                            ) : null}

                            <div className="loginbutton-container">
                                <Button type="submit" className='login-button' variant='contained' onClick={() => login(username, password, navigate)}>Login</Button>
                            </div>

                            <h4 className="line"><span>Or</span></h4>

                            <div className="registerbutton-container">
                                <Button type="submit" className='register-button' variant='contained' onClick={() => navigate('/signup')}>Register Restraunt</Button>
                            </div>
                        </StyledEngineProvider>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default SignIn;