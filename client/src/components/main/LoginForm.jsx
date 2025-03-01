// import React, { useState } from 'react';
// import { Modal, Box, Typography, TextField, Button, Tab, Tabs } from '@mui/material';
// import { LOGIN_USER } from '../../utils/mutations';
// import { useMutation } from '@apollo/client'; 
// import Auth from '../../utils/auth'; 

// const LoginForm = ({ open, onClose }) => {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleLoginSubmit = async () => {
//         try {
//             const response = await loginUser({
//                 variables: {
//                     email: formData.email,
//                     password: formData.password,
//                 },
//             });

//             Auth.login(data.login.token);
//             onClose(); // Close the modal
//         } catch (error) {
//             console.error('Error logging in:', error);
//         }
//     };

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 300 }}>
//                 <Typography variant="h6" gutterBottom>
//                     Log In
//                 </Typography>
//                 <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
//                 <TextField label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" type="password" />
//                 <Button variant="contained" color="primary" onClick={handleLoginSubmit} fullWidth>
//                     Log In
//                 </Button>
//             </Box>
//         </Modal>
//     );
// };

// export default LoginForm;