import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEcomStore from '../../store/ecom_store';
import { infoAboutMe } from '../../api/User';

function UserInfo() {
    const [user, setUser] = useState(''); //ตัวแปรเก็บข้อมูลผู้ใช้
    const token = useEcomStore((state) => state.token); //เรียกใช้ token 
 
    //ดึงข้อมูลผู้ใช้
    const fetchAboutMe = async () => {
        try {
            const res = await infoAboutMe(token);
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching user info:', err);
        }
    };

    useEffect(() => {
        fetchAboutMe();
    }, [user]); //เมื่อข้อมูลผู้ใช้มีการเปลี่ยนแปลงให้เรียก fetch อีกรอบ

    //สำหรับแสดงข้อมูลโปรไฟล์
    const renderUserInfo = () => {
        //ถ้ายังไม่ได้กรอกข้อมูลอะไรเลย
        if (!user) {
            return <h4 className="text-danger">ยังไม่ได้กรอกข้อมูลส่วนตัว</h4>;
        }
        // ถ้ายังไม่ได้กรอกข้อมูลบางส่วน
        const checkProfile = !user.fName || !user.lName || !user.email || !user.telNo;
        if (checkProfile) {
            return (
                <>
                    <h5>
                        {user.fName || <span style={{ color: 'orange' }}>กรุณากรอกชื่อ</span>} {user.lName || <span style={{ color: 'orange' }}>กรุณากรอกนามสกุล</span>}
                    </h5>
                    <h4>อีเมล: {user.email || <span style={{ color: 'orange' }}>กรุณากรอกอีเมล</span>}</h4>
                    <h4>เบอร์โทร: {user.telNo || <span style={{ color: 'orange' }}>กรุณากรอกเบอร์โทร</span>}</h4>
                    <p style={{ color: 'red' }}>โปรดกรอกข้อมูลให้ครบถ้วน</p>
                </>
            );
        }

        return (
            <>
                <h2 className='mb-3'>
                    {user.fName} {user.lName}
                </h2>
                <h4 className='mb-3'>อีเมล: {user.email}</h4>
                <h4 className='mb-3'>เบอร์โทร: {user.telNo}</h4>
                <p>ที่อยู่: {user.address}</p>
            </>
        );
    };

    return (
        <div>
            <div className="container">
                <h1 className="mt-5">ข้อมูลผู้ใช้</h1>
                <div className="card mt-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-2">
                                <div className="userprofile"></div>
                            </div>
                            <div className="col-8">
                                {renderUserInfo()}
                            </div>
                            <div className="col-2">
                                <Link to="../useredit">
                                    <button className="btn btn-custom w-100">แก้ไขข้อมูล</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
