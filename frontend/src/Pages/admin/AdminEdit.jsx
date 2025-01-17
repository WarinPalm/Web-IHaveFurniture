import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEcomStore from '../../store/ecom_store';
import { infoAboutMe, updateUserInfo } from '../../api/User';
import { toast } from "react-toastify";

function AdminEdit() {
    const [user, setUser] = useState(''); //ตัวแปรเก็บข้อมูลผู้ใช้
    const [form, setForm] = useState({fName: '', lName: '', telNo: '', address: ''}); //สร้างฟอร์มสำหรับส่ง backend

    const token = useEcomStore((state) => state.token); //เรียกใช้ token

    //ดึงข้อมูลผู้ใช้
    const fetchAboutMe = async () => {
        try {
            const res = await infoAboutMe(token);
            setUser(res.data);
            setForm({ //ถ้าอันไหนดึงมาไม่ได้ ให้เป็นค่าว่าง
                fName: res.data.fName || '',
                lName: res.data.lName || '',
                telNo: res.data.telNo || '',
                address: res.data.address || ''
            });
        } catch (err) {
            console.error('Error fetching user info:', err);
        }
    };

    useEffect(() => {
        fetchAboutMe();
    }, []);

    const handleOnChange = (e) => { // สำหรับอัพเดทค่าก่อนเอาเข้าฟอร์ม
        setForm({...form, [e.target.name]: e.target.value,});
    };

    const handleEditProfile = async (e) => { // สำหรับแก้ไขข้อมูลส่วนตัว
        e.preventDefault();
        try {
            await updateUserInfo(token, form);
            toast.success('แก้ไขข้อมูลสำเร็จ');
        } catch (err) {
            console.error(err);
            toast.error('ไม่สามารถแก้ไขข้อมูลได้');
        }
    };

    if (!user) { //ถ้าไม่มีข้อมูลโชว์ให้ขึ้นว่า loading
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container">
                <form onSubmit={handleEditProfile}>
                    <h1 className="mt-5">แก้ไขข้อมูลแอดมิน</h1>
                    <div className="card mt-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-2 ms-5">
                                    <div className="adminprofile"></div>
                                </div>
                                <div className="col-9 row">
                                    <div className="col-6">
                                        <label htmlFor="fName" className="mb-2">ชื่อจริง</label>
                                        <input type="text" className="form-control" id="fName" name="fName" value={form.fName}
                                            onChange={handleOnChange} placeholder="ชื่อ" />

                                        <label htmlFor="telNo" className="mt-4 mb-2">เบอร์โทร</label>
                                        <input type="text" className="form-control" id="telNo" name="telNo" value={form.telNo}
                                            onChange={handleOnChange} placeholder="เบอร์โทร" />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="lName" className="mb-2">นามสกุล</label>
                                        <input type="text" className="form-control" id="lName" name="lName" value={form.lName}
                                            onChange={handleOnChange} placeholder="นามสกุล"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="address" className="mt-3">ที่อยู่</label><br />
                                        <textarea id="address" name="address" className="form-control mt-3" value={form.address}
                                            onChange={handleOnChange}placeholder="ที่อยู่ของคุณ"
                                            style={{ resize: 'none', height: '150px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-10"></div>
                        <div className="col-1 text-end">
                            <Link to="../admininfo"><button type="button" className="btn btn-custom w-100">กลับ</button></Link>
                        </div>
                        <div className="col-1 text-end">
                            <button type="submit" className="btn btn-custom w-100">ยืนยัน</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminEdit;
