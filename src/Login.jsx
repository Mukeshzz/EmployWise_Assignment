import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './components/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { toast } from 'sonner';



const BASE_URL = 'https://reqres.in/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      localStorage.setItem('token', response.data.token); // Or sessionStorage
      setToken(response.data.token);
      toast.success("Login Successfully")
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      toast.error("Login Failed")
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 p-4">
        <CardHeader className="text-xl font-bold">
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;