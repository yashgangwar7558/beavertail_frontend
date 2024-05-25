// import Logo from '../../assets/logo/logo.png';
import Logo from '../../assets/logo/greenCactusAi.png';
import Background from '../../assets/background1.jpg';
import './SignIn.css'
import { useNavigate } from 'react-router'
import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig'
import Spinner from 'react-native-loading-spinner-overlay';
import { Box, Button, IconButton, TextField, InputAdornment, StyledEngineProvider } from '@mui/material'
import { AccountCircleRounded, LockRounded, VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';

const SignIn = ({ navigation }) => {
    const navigate = useNavigate({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading, login, error, setError } = useContext(AuthContext);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            login(username, password, navigate);
        }
    }

    return (
        <div className='login-screen'>
            <div className='login-card'>
                <div>
                    <div className='logo-container-l'>
                        <img src={Logo} alt="logo" className='logo-image-l' />
                        <h1 className='logo-label-l'>cactus.ai</h1>
                    </div>
                    <Box>
                        <Spinner visible={isLoading} />
                        <StyledEngineProvider injectFirst>
                            <div className='input-container-l' id='username'>
                                <TextField type="text" fullWidth placeholder='Username'
                                    name='username' value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    variant='standard'
                                    onKeyDown={handleKeyDown}
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
                            <div className="input-container-l" id='password'>
                                <TextField type={showPassword ? 'text' : 'password'} fullWidth placeholder='Password'
                                    name='password' value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    variant='standard'
                                    onKeyDown={handleKeyDown}
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

                            <div className="loginbutton-container-l">
                                <Button
                                    type="submit"
                                    className="login-button-l"
                                    autoFocus
                                    variant="contained"
                                    focusRipple={false}
                                    onKeyDown={handleKeyDown}
                                    onClick={() => login(username, password, navigate)}
                                >
                                    Login
                                </Button>
                            </div>

                            <h4 className="loginline"><span>Or</span></h4>

                            <div className="registerbutton-container-l">
                                <Button type="submit" className='register-button-l' variant='contained' onClick={() => { navigate('/signup'), setError('') }}>Register User</Button>
                            </div>
                        </StyledEngineProvider>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default SignIn;