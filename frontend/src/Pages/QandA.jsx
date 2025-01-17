import React, { useState } from 'react';

function QandA() {
  const [openCard, setOpenCard] = useState('');

  const toggleCard = (index) => {
    setOpenCard(openCard === index ? '' : index);
  };

  return (
    <div className="container">
      <h1 className="mt-4">คำถามที่พบบ่อย</h1>
      <h2 className="mt-3 mb-5">คุณอยากให้เราช่วยเรื่องอะไรเหรอ?</h2>

      {/* คำถามที่ 1 */}
      <div className="card card-hover mt-3" onClick={() => toggleCard(1)}>
        <div className="card-body">
          <p>1. ฉันจะสั่งซื้อสินค้าได้อย่างไร</p>
          {openCard === 1 && (
            <div className="mt-2">
              <ul>
                <li>เลือกสินค้าที่ต้องการจากหน้าเว็บไซต์</li>
                <li>คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบนของเว็บไซต์</li>
                <li>ตรวจสอบสินค้าและยอดชำระแล้วทำการกดปุ่มดำเนินการต่อ</li>
                <li>เลือกวันที่ต้องการโอนเงิน และข้อมูลการรับสินค้า</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* คำถามที่ 2 */}
      <div className="card card-hover mt-3" onClick={() => toggleCard(2)}>
        <div className="card-body">
          <p>2. ฉันจะสามารถชำระเงินด้วยวิธีการใด</p>
          {openCard === 2 && (
            <div className="mt-2">
              <ul>
                <li>เลือกสินค้าที่ต้องการจากหน้าเว็บไซต์</li>
                <li>คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบนของเว็บไซต์</li>
                <li>ตรวจสอบสินค้าและยอดชำระแล้วทำการกดปุ่มดำเนินการต่อ</li>
                <li>เลือกวันที่ต้องการโอนเงิน และข้อมูลการรับสินค้า</li>
              </ul>            
            </div>
          )}
        </div>
      </div>

      {/* คำถามที่ 3 */}
      <div className="card card-hover mt-3" onClick={() => toggleCard(3)}>
        <div className="card-body">
          <p>3. ฉันจะสามารถดูค่าจัดส่งได้ที่ใด</p>
          {openCard === 3 && (
            <div className="mt-2">
              <ul>
                <li>เลือกสินค้าที่ต้องการจากหน้าเว็บไซต์</li>
                <li>คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบนของเว็บไซต์</li>
                <li>ตรวจสอบสินค้าและยอดชำระแล้วทำการกดปุ่มดำเนินการต่อ</li>
                <li>เลือกวันที่ต้องการโอนเงิน และข้อมูลการรับสินค้า</li>
              </ul>            
          </div>
          )}
        </div>
      </div>

      {/* คำถามที่ 4 */}
      <div className="card card-hover mt-3" onClick={() => toggleCard(4)}>
        <div className="card-body">
          <p>4. ฉันจะตรวจสอบใบเสร็จได้จากที่ใด</p>
          {openCard === 4 && (
            <div className="mt-2">
              <ul>
                <li>เลือกสินค้าที่ต้องการจากหน้าเว็บไซต์</li>
                <li>คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบนของเว็บไซต์</li>
                <li>ตรวจสอบสินค้าและยอดชำระแล้วทำการกดปุ่มดำเนินการต่อ</li>
                <li>เลือกวันที่ต้องการโอนเงิน และข้อมูลการรับสินค้า</li>
              </ul>            
          </div>
          )}
        </div>
      </div>

      {/* คำถามที่ 5 */}
      <div className="card card-hover mt-3" onClick={() => toggleCard(5)}>
        <div className="card-body">
          <p>5. ฉันจะยกเลิกคำสั่งซื้อได้อย่างไร</p>
          {openCard === 5 && (
            <div className="mt-2">
              <ul>
                <li>เลือกสินค้าที่ต้องการจากหน้าเว็บไซต์</li>
                <li>คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบนของเว็บไซต์</li>
                <li>ตรวจสอบสินค้าและยอดชำระแล้วทำการกดปุ่มดำเนินการต่อ</li>
                <li>เลือกวันที่ต้องการโอนเงิน และข้อมูลการรับสินค้า</li>
              </ul>            
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QandA;
