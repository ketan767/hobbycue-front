import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'

import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import OutlinedButton from '../_buttons/OutlinedButton'

import styles from './AuthForm.module.css'
import { signIn } from '@/services/authService'

interface Props {}

type tabs = 'sign-in' | 'join-in'

function validatePassword(password: string) {
  const validation = {
    lowercase: /^(?=.*[a-z])/.test(password),
    uppercase: /^(?=.*[A-Z])/.test(password),
    number: /^(?=.*\d)/.test(password),
    specialChar: /^(?=.*[@$!%*?&])/.test(password),
    length: /^(?=.{8,})/.test(password),
  }
  return validation
}

const AuthForm: React.FC<Props> = (props) => {
  const [selectedTab, setSelectedTab] = useState<tabs>('sign-in')
  const [inputData, setInputData] = useState({ email: '', password: '', rememberMe: false })
  const [inputValidation, setInputValidation] = useState(validatePassword(inputData.password))
  const [showValidationConditions, setShowValidationConditions] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleTabChange = (value: tabs) => {
    setSelectedTab(value)
    setInputData({ email: '', password: '', rememberMe: false })
  }

  const handleSubmit = () => {
    if (selectedTab === 'sign-in') {
      signIn({ email: inputData.email, password: inputData.password }, (err, res) => {
        if (err) return console.log(err.response)
        console.log(res)
      })
    } else {
    }
  }

  // Social Login Handle
  const googleAuthSuccess = (e: any) => {
    console.log(e)
    // setSpin(true)
    // Services.oAuth.googleSignin({ tokenId: e.tokenId }, setSpin, setSignedIn)
  }
  const googleAuthFailure = (e: any) => {
    console.log(e)
  }
  const facebookAuth = (e: any) => {
    console.log('Event', e)
    // setSpin(true)
    // Services.oAuth.facebookSignin(
    //   {
    //     accessToken: e.accessToken,
    //     userID: e.userID,
    //   },
    //   setSpin,
    //   setSignedIn,
    // )
    // console.log("New Resp", response);
  }

  return (
    <div className={styles['form-contanier']}>
      {/* Tab Switcher (SignIn / JoinIn )  */}
      <Tabs value={selectedTab} onChange={(e, value: tabs) => handleTabChange(value)}>
        <Tab sx={{ margin: 0 }} label={'Sign In'} value={'sign-in'} className={styles['tab-btn']} />
        <Tab sx={{ margin: 0 }} label={'Join In'} value={'join-in'} className={styles['tab-btn']} />
      </Tabs>

      {/* Google - Facebook Login Buttons */}
      <section className={styles['social-login-btns']}>
        <GoogleLogin
          clientId="795616019189-b0s94ri1i98355rjv1pg6ai588k0k87d.apps.googleusercontent.com"
          render={(renderProps) => (
            <Button
              className={`${styles['social-login-btn']} ${styles['google']}`}
              onClick={renderProps.onClick}
            >
              Continue with Google
            </Button>
          )}
          onSuccess={googleAuthSuccess}
          onFailure={googleAuthFailure}
        />
        <FacebookLogin
          appId="1614660215286765"
          callback={facebookAuth}
          render={(renderProps: any) => (
            <Button
              className={`${styles['social-login-btn']} ${styles['facebook']}`}
              onClick={renderProps.onClick}
            >
              Continue with Facebook
            </Button>
          )}
        />
      </section>

      {/* Divider */}
      <div className={styles['divider']}>
        {selectedTab === 'sign-in' && <span>Or Sign In with Email</span>}
        {selectedTab === 'join-in' && <span>Or Join with Email</span>}
      </div>

      {/* Email - Password Fields */}
      <FormControl className={styles['form-body']}>
        <div className={styles['email-field']}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            value={inputData.email}
            onChange={(e) =>
              setInputData((prev) => {
                return { ...prev, email: e.target.value }
              })
            }
          />
        </div>

        <div className={styles['password-field']}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            sx={{ '& .MuiOutlinedInput-root': { padding: 0, background: 'white' } }}
            variant="outlined"
            autoComplete={selectedTab === 'join-in' ? 'new-password' : 'current-password'}
            size="small"
            helperText=""
            onChange={(e) =>
              setInputData((prev) => {
                return { ...prev, password: e.target.value }
              })
            }
            value={inputData.password}
            onFocus={() => setShowValidationConditions(true)}
            onBlur={() => setShowValidationConditions(false)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                </IconButton>
              ),
            }}
          />

          {/* Validation Conditions Box */}
          {selectedTab === 'join-in' && showValidationConditions && (
            <div className={styles['validation-messages']}>
              <p className={inputValidation.lowercase ? styles['valid'] : undefined}>
                Must contain at least one lowercase letter
              </p>
              <p className={inputValidation.uppercase ? styles['valid'] : undefined}>
                Must contain at least one uppercase letter
              </p>
              <p className={inputValidation.number ? styles['valid'] : undefined}>
                Must contain at least one number
              </p>
              <p className={inputValidation.specialChar ? styles['valid'] : undefined}>
                Must contain at least one special character
              </p>
              <p className={inputValidation.length ? styles['valid'] : undefined}>
                Must be at least 8 characters long
              </p>
            </div>
          )}
        </div>
      </FormControl>

      {/* Remember Me - Forgot Password / Accept Terms & Submit Button */}
      <section className={styles['form-footer']}>
        <div className={styles['form-footer-top']}>
          {selectedTab === 'sign-in' && (
            <>
              <FormControlLabel
                className={styles['remember-me-btn']}
                style={{ margin: 0 }}
                control={
                  <Checkbox
                    size="small"
                    color="primary"
                    checked={inputData.rememberMe}
                    onChange={(e) =>
                      setInputData((prev) => {
                        return { ...prev, rememberMe: !prev.rememberMe }
                      })
                    }
                  />
                }
                label={'Remember Me'}
              />
              <button className={styles['forgot-pass-btn']}>
                <svg
                  width="12"
                  height="15"
                  viewBox="0 0 12 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 5.33342H9.33335V4.00008C9.33335 2.16008 7.84002 0.666748 6.00002 0.666748C4.16002 0.666748 2.66669 2.16008 2.66669 4.00008V5.33342H2.00002C1.26669 5.33342 0.666687 5.93341 0.666687 6.66675V13.3334C0.666687 14.0667 1.26669 14.6667 2.00002 14.6667H10C10.7334 14.6667 11.3334 14.0667 11.3334 13.3334V6.66675C11.3334 5.93341 10.7334 5.33342 10 5.33342ZM6.00002 11.3334C5.26669 11.3334 4.66669 10.7334 4.66669 10.0001C4.66669 9.26675 5.26669 8.66675 6.00002 8.66675C6.73335 8.66675 7.33335 9.26675 7.33335 10.0001C7.33335 10.7334 6.73335 11.3334 6.00002 11.3334ZM4.00002 5.33342V4.00008C4.00002 2.89341 4.89335 2.00008 6.00002 2.00008C7.10669 2.00008 8.00002 2.89341 8.00002 4.00008V5.33342H4.00002Z"
                    fill="#939CA3"
                  />
                </svg>

                <span>Forgot password?</span>
              </button>
            </>
          )}
          {selectedTab === 'join-in' && (
            <p className={styles['agree-tnc-info']}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          )}
        </div>
        <OutlinedButton onClick={handleSubmit} className={styles['submit-btn']}>
          Continue
        </OutlinedButton>
      </section>
    </div>
  )
}

export default AuthForm
