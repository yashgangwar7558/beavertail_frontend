import Logo from '../../assets/logo/blackCactusAi.png';
import './SignUp.css'
import { useNavigate } from 'react-router'
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig'
import Spinner from 'react-native-loading-spinner-overlay';
import { Box, Button, IconButton, TextField, InputAdornment, StyledEngineProvider, Divider, Autocomplete, Radio, Paper } from '@mui/material'
import { pink } from '@mui/material/colors'
import { AccountCircleRounded, LockRounded, VisibilityOffRounded, VisibilityRounded, Person, MailRounded, CallRounded, LocationCityRounded, SearchRounded } from '@mui/icons-material';

const SignUp = ({ navigation }) => {
  const navigate = useNavigate({});
  const [tenants, setTenants] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [rolesAssigned, setRolesAssigned] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [status, setStatus] = useState('pending_admin_approval');

  const { isLoading, register, error, setError } = useContext(AuthContext);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      register(username, password, confirmPassword, firstName, lastName, email, mobileNo, address, rolesAssigned, tenantId, status, navigate)
    }
  }

  const getTenantIds = async () => {
    try {
      const result = await client.post('/get-tenantids', {
        headers: { 'Content-Type': 'application/json' },
      })
      setTenants(result.data.tenants)
    } catch (error) {
      console.log(`getting tenants error ${error}`);
    }
  }


  useEffect(() => {
    getTenantIds();
  }, []);

  const fetchAdminRole = async () => {
    try {
      const data = {
        tenantId,
        roleName: 'Admin'
      }
      const result = await client.post('/get-role', data, {
        headers: { 'Content-Type': 'application/json' },
      })
      return result.data.role
    } catch (error) {
      console.log(`getting tenant admin role error ${error}`);
    }
  }

  useEffect(() => {
    const fetchAndSetAdminRole = async () => {
      if (status === 'pending_superadmin_approval' && tenantId) {
        const roles = await fetchAdminRole(tenantId);
        setRolesAssigned(roles);
      } else if (status === 'pending_admin_approval') {
        setRolesAssigned([]);
      }
    };

    fetchAndSetAdminRole();
  }, [status, tenantId]);

  return (
    <div className='signup-screen'>
      <div className='signup-card'>
        <div className='logo-container-s'>
          <img src={Logo} alt="logo" className='logo-image-s' />
          <h1 className='logo-label-s'>cactus.ai</h1>
        </div>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, margin: '0 0' }}>
          <Box>
            <Spinner visible={isLoading} />
            <StyledEngineProvider injectFirst>
              <div className="form-container">
                <div className='left-container'>
                  <div className='name-container' id='firstname'>
                    <TextField type="text" fullWidth placeholder='Firstname'
                      name='firstname' value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      onKeyDown={handleKeyDown}
                      variant='standard'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Person />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                    />
                    <TextField type="text" fullWidth placeholder='Lastname'
                      name='lastname' value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      onKeyDown={handleKeyDown}
                      variant='standard'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Person />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                    />
                  </div>
                  <div className='input-container' id='email'>
                    <TextField type="text" fullWidth placeholder='Email'
                      name='email' value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onKeyDown={handleKeyDown}
                      variant='standard'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <MailRounded />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                    />
                  </div>
                  <div className='input-container' id='mobileNo'>
                    <TextField type="text" fullWidth placeholder='Mobile Number'
                      name='mobileNo' value={mobileNo}
                      onChange={(event) => setMobileNo(event.target.value)}
                      onKeyDown={handleKeyDown}
                      variant='standard'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <CallRounded />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                    />
                  </div>
                  <div className='input-container' id='address'>
                    <TextField type="text" fullWidth placeholder='Address'
                      name='address' value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      onKeyDown={handleKeyDown}
                      variant='standard'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LocationCityRounded />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                    />
                  </div>
                </div>
                {/* <Divider orientation="vertical" flexItem /> */}
                <div className='right-container'>
                  <div className='input-container' id='radio'>
                    <Radio
                      checked={status === 'pending_admin_approval'}
                      onChange={(event) => setStatus(event.target.value)}
                      onKeyDown={handleKeyDown}
                      value="pending_admin_approval"
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'A' }}
                    />
                    <label htmlFor="radio-buttons" style={{ color: 'black' }}>User</label>

                    <Radio
                      checked={status === 'pending_superadmin_approval'}
                      onChange={(event) => setStatus(event.target.value)}
                      onKeyDown={handleKeyDown}
                      value="pending_superadmin_approval"
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'B' }}
                    />
                    <label htmlFor="radio-buttons" style={{ color: 'black' }}>Admin</label>
                  </div>
                  <div className="input-container" id="tenant">
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={tenants}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth placeholder='Choose Restaurant'
                          variant='standard'
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchRounded />
                              </InputAdornment>
                            ),
                            disableUnderline: true,
                          }}
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setTenantId(newValue.id);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className='input-container' id='username'>
                    <TextField type="text" fullWidth placeholder='Username'
                      name='username' value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      onKeyDown={handleKeyDown}
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
                  <div className="password-container" id='password'>
                    <TextField type={showPassword ? 'text' : 'password'} fullWidth placeholder='Password'
                      name='password' value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={handleKeyDown}
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
                    <TextField type={showPassword ? 'text' : 'password'} fullWidth placeholder='Confirm Password'
                      name='confirmPassword' value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      onKeyDown={handleKeyDown}
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
                </div>
              </div>

              {error ? (
                <p className='error-msg'>{error}</p>
              ) : null}

              <div className="button-container-signup">
                <Button type="submit" className='register-button-signup' variant='contained'
                  autoFocus
                  focusRipple={false}
                  onKeyDown={handleKeyDown}
                  onClick={() => register(username, password, confirmPassword, firstName, lastName, email, mobileNo, address, rolesAssigned, tenantId, status, navigate)}>Register User</Button>
                <h4 className="line-signup"><span>Or</span></h4>
                <Button type="submit" className='login-button-signup' variant='contained' onClick={() => { navigate('/signin'), setError('') }}>Login</Button>
              </div>
            </StyledEngineProvider>
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default SignUp;
