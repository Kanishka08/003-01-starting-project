import React, { useEffect, useState, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action)=>{
  if(action.type === "USER_INPUT"){
    return {value: action.val, isValid: action.val.include('@')};
  }
  if(action.type === "INPUT_BLUR"){
    return {value: state.value, isValid: state.value.include('@')};
  }
  return {value: '',isValid: false};
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [enteredCollegeName, setEnteredCollegeName] = useState('');
  const [collegeNameIsValid, setCollegeNameIsValid] = useState();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value:'', isValid: null});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });

  const authctx = useContext(AuthContext);
  useEffect(() => {
    console.log('EFFECT RUNNING');
    return () => {
      console.log('EFFECT ClEANUP');
    }
  }, []);
  
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity');
      setFormIsValid(
        emailIsValid && passwordIsValid && collegeNameIsValid
      );
    }, 500);

    return ()=>{
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid,passwordIsValid,collegeNameIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val:event.target.value});

    setFormIsValid(
            event.target.value.includes('@') && passwordState.isValid && enteredCollegeName.trim() !== ''
          );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    setFormIsValid(
      event.target.value.trim().length > 6 && emailState.value.includes('@')
    );
  };

  const collegeNameChangeHandler = (event) => {
    setEnteredCollegeName(event.target.value);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.value.includes('@'));
    dispatchEmail({type: "INPUT_BLUR"});
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const validateCollegeNameHandler = () => {
    setCollegeNameIsValid(enteredCollegeName.trim() !== '');
  };


  const submitHandler = (event) => {
    event.preventDefault();
    authctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input id="email" label="E-Mail" type="email" isValid={emailIsValid} value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}/>

      <Input id="password" label="Password" type="password" isValid={passwordIsValid} value={passwordState.value}
        onChange={passwordChangeHandler}
        onBlur={validatePasswordHandler}/>
       
       
        <Input id="collegeName" label="college Name" type="text" value={enteredCollegeName} isValid={collegeNameIsValid} 
        onChange={collegeNameChangeHandler}
        onBlur={validateCollegeNameHandler}/>
       
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
