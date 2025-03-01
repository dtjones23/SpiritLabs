// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { Modal, Box, Typography, TextField, Button } from '@mui/material';
// import { ADD_USER } from '../../utils/mutations'; 
// import Auth from '../../utils/auth'; 

// const SignUpForm = ({ open, onClose }) => {
//     const [formData, setFormData] = useState({ email: '', userName: '', password: '' });
//     const [addUser, { loading, error }] = useMutation(ADD_USER);


//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSignupSubmit = async () => {
//         try {
//             const { data } = await addUser({
//                 variables: {
//                     email: formData.email,
//                     userName: formData.userName,
//                     password: formData.password
//                 }
//             });

//             // Handle successful signup
//             Auth.login(data.addUser.token);
//             onClose(); 
//         } catch (error) {
//             console.error('Error signing up:', error);
//         }
//     };
//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#0067a3', boxShadow: 24, p: 7, minWidth: 300, borderRadius: "50px" }}>
//                 <Typography variant="h6" gutterBottom>
//                     Sign Up
//                 </Typography>
//                 <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
//                 <TextField label="Username" name="userName" value={formData.userName} onChange={handleChange} fullWidth margin="normal" />
//                 <TextField label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" type="password" />
//                 <Button variant="contained" color="primary" onClick={handleSignupSubmit} fullWidth>
//                     Sign Up
//                 </Button>
//             </Box>
//         </Modal>
//     );
// };

// export default SignUpForm;