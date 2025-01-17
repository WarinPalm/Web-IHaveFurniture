import React, { useEffect, useState } from 'react';
import { getAllCategory } from '../api/category';

const Category = ({ onCategoryClick, activeCategory }) => {
    const [categories, setCategories] = useState([]); //ตัวแปรเก็บหมวดหมู่
    const categoriesNotBanner = categories.filter(category => category.name !== 'banner') //เอาหมวดหมู่ทั้งหมดที่ไม่ใช่ banner

    //ดึงข้อมูลหมวดหมู่
    const fetchCategories = async ()=>{
        try{
            const res = await getAllCategory();
            setCategories(res.data);
        }catch(err){
            console.error(err)
        }
    }
    useEffect(() => {    
        fetchCategories();
    }, []);
    
    return (
        <>
        <aside className="col-2 full-height-overflow text-center">
            <ul className="nav-aside">
        
            {categoriesNotBanner.map(category => (
                <li
                    key={category.id}
                    className={`category-nav ${activeCategory === category.name ? 'active' : ''}`}
                    onClick={() => onCategoryClick(category.name)}
                >
                    {category.name}
                </li>
            ))}

            </ul>
        </aside>
        
        </>
    );
};

export default Category;
