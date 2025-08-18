import { faCog, faPlus, faSearch, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import Pagination from "@/components/Pagination";

import { InputGroup, FormControl } from "react-bootstrap";
import Toolbar from "@/components/Toolbar";
import ActionModal from "@/components/ActionModal";
import FormInput from "@/components/FormInput";
const sampleData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    category: `Category ${index % 5 + 1}`,
}));

const ITEMS_PER_PAGE = 10; // Number of rows per page


const Index: React.FC = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 5;  // Example total pages
    const totalCount = 50;  // Example total records

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    const paginatedData = sampleData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );
    const handleRefresh = () => { 
        // Add your refresh logic here (API call, state update, etc.)
    };



    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = () => {
        let newErrors: { name?: string; email?: string; phone?: string } = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } 
        handleClose();
    };




    return <section>
        <Toolbar
            title="Leave Request"
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onSearch={(query) => console.log("Search query:", query)}
            onRefresh={handleRefresh}
            onAdd={() => setShow(true)}
        />


        <ActionModal
            show={show}
            title="Add Leave Request"
            formData={formData}
            errors={errors}
            onClose={handleClose}
            onSubmit={handleSubmit}
            onChange={handleChange}
        >
            <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
            <FormInput label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} required />
        </ActionModal>


        <div className="table-container table-responsive tableReponsivecontainer">
            <table className="table table-bordered">
                <thead className="table-header-bg text-white" style={{ position: 'sticky', top: 0, backgroundColor: "#32ab9b" }}>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    </section>
};

export default Index;
