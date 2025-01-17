import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom_store";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const navigate = useNavigate();
    const actionLogin = useEcomStore((state) => state.actionLogin);
    const user = useEcomStore((state) => state.user);
    console.log('user from zustand', user);

    const [form, setForm] = useState({ email: "", password: "" });

    const handleOnChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value,});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await actionLogin(form);
            const role = res.data.payload.role;
            roleRedirect(role);
            toast.success('ยินดีต้อนรับ');
        } catch (err) {
            console.log(err);

            toast.error('ไม่พบผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง');
        }
    };

    const roleRedirect = (role) => {
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-login" >
            <div className="card p-5 shadow-lg login-form w-25">
                <h3 className="card-title text-center mb-4">เข้าสู่ระบบ</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label" >อีเมล</label>
                        <input
                            className="form-control input-login"
                            id="email"
                            onChange={handleOnChange}
                            name="email"
                            type="email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">รหัสผ่าน</label>
                        <input
                            className="form-control input-login"
                            id="password"
                            onChange={handleOnChange}
                            name="password"
                            type="password"
                            required
                            
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-custom w-50">ยืนยัน</button>
                    </div>

                </form>
                <div className="text-center mt-4">
                    <Link to="../register" style={{ color: '#a18e81' }}>สมัครสมาชิก</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
