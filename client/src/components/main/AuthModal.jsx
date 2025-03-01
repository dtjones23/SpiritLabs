import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Tab, Tabs } from '@mui/material';
import { LOGIN_USER, ADD_USER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';


const AuthModal = ({ open, onClose }) => {

    const [formData, setFormData] = useState({ email: '', userName: '', password: '' });
    const [isLoginTab, setIsLoginTab] = useState(true); // This will be how we switch between the login and signup tabs
    const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_USER);
    const [addUser, { loading: signupLoading, error: signupError }] = useMutation(ADD_USER);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async () => {
        try {
            const response = await loginUser({
                variables: {
                    email: formData.email,
                    password: formData.password,
                },
            });

            Auth.login(response.data.login.token);
            onClose(); 
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleSignupSubmit = async () => {
        try {
            const { data } = await addUser({
                variables: {
                    email: formData.email,
                    userName: formData.userName,
                    password: formData.password
                }
            });

            Auth.login(data.addUser.token);
            onClose(); 
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: 'solid 2px #1D1D1D',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
      };

    return (
        <>
        
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >

            <Fade in={open}>

                <Box sx={style}>

                    <Tabs value={isLoginTab ? 0 : 1} sx={{mb: "8px"}} // The way the tabs are set up, 0 is the index of the login tab and 1 is the index of the signup tab
                        onChange={() => setIsLoginTab(!isLoginTab)}>
                        <Tab label="Log In"  />
                        <Tab label="Sign Up" />
                    </Tabs>

                    {/* <Typography id="transition-modal-title" variant="h7" component="h3">
                    {isLoginTab ? 'Log In' : 'Sign Up'} 
                    </Typography> */}

                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />

                    {!isLoginTab && <TextField label="Username" name="userName" value={formData.userName} onChange={handleChange} fullWidth margin="normal" />}

                    <TextField label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" type="password" />

                    <Button variant="contained" onClick={isLoginTab ? handleLoginSubmit : handleSignupSubmit} sx={{mt: "16px"}} fullWidth>
                    {isLoginTab ? 'Log In' : 'Sign Up'}
                    </Button>

                </Box>

            </Fade>

        </Modal>
        </>
    );
};

export default AuthModal;
