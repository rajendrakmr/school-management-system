import React, { useState } from "react";
import Toolbar from "@/components/Toolbar";
import TableComponent from "@/components/Table/TableComponent";
import PageNumber from "@/components/PageNumber";
import SettingsModal from "@/components/Table/SettingsModal";
import AdvancedFilter from "@/components/AdvancedFilter";
import InputFormField from "@/components/InputFormField";
import { useGetLeaveTypesQuery } from "@/store/slice/leaveTypeApi";
import { Column } from "@/utils/helper"; 
import AddEditForm from "./AddEditForm";

const Index: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: dataRecords, isFetching, refetch } = useGetLeaveTypesQuery(
    { limit: itemsPerPage, page: currentPage, filter },
    { refetchOnMountOrArgChange: true }
  );

  const item = [
        {
            "id": "1",
            "name": "Green Valley Public School",
            "code": "GVPS001",
            "address": "MG Road, Sector 12",
            "city": "Delhi",
            "state": "Delhi",
            "country": "India",
            "pincode": "110001",
            "phone": "+91-9876543210",
            "email": "info@gvps.edu.in",
            "principal_name": "Dr. Anil Sharma",
            "established_year": 1995,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "2",
            "name": "St. Mary’s High School",
            "code": "SMHS002",
            "address": "Park Street",
            "city": "Kolkata",
            "state": "West Bengal",
            "country": "India",
            "pincode": "700016",
            "phone": "+91-9123456789",
            "email": "contact@stmaryskolkata.org",
            "principal_name": "Sister Teresa D’Silva",
            "established_year": 1972,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "3",
            "name": "Kendriya Vidyalaya No.1",
            "code": "KVN003",
            "address": "Ashok Nagar",
            "city": "Bhopal",
            "state": "Madhya Pradesh",
            "country": "India",
            "pincode": "462023",
            "phone": "+91-9823456780",
            "email": "kv1bhopal@kvmail.gov.in",
            "principal_name": "Mr. Rajeev Mehta",
            "established_year": 1980,
            "type": "Government",
            "status": "Active"
        },
        {
            "id": "4",
            "name": "Delhi Public School",
            "code": "DPS004",
            "address": "NH-24, Indirapuram",
            "city": "Ghaziabad",
            "state": "Uttar Pradesh",
            "country": "India",
            "pincode": "201014",
            "phone": "+91-9812345678",
            "email": "dpsindirapuram@dps.edu.in",
            "principal_name": "Mrs. Kavita Bansal",
            "established_year": 2003,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "5",
            "name": "Springfield International",
            "code": "SFI005",
            "address": "Near IT Park",
            "city": "Bangalore",
            "state": "Karnataka",
            "country": "India",
            "pincode": "560103",
            "phone": "+91-9001234567",
            "email": "admissions@springfieldint.com",
            "principal_name": "Mr. Arjun Reddy",
            "established_year": 2010,
            "type": "International",
            "status": "Active"
        },
        {
            "id": "6",
            "name": "Little Flower Convent",
            "code": "LFC006",
            "address": "Church Road",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "country": "India",
            "pincode": "600034",
            "phone": "+91-9345678901",
            "email": "littleflowerchennai@gmail.com",
            "principal_name": "Rev. Father Joseph",
            "established_year": 1965,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "7",
            "name": "DAV Public School",
            "code": "DAV007",
            "address": "Civil Lines",
            "city": "Nagpur",
            "state": "Maharashtra",
            "country": "India",
            "pincode": "440001",
            "phone": "+91-9988776655",
            "email": "davnagpur@davmail.com",
            "principal_name": "Mrs. Leena Nair",
            "established_year": 1990,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "8",
            "name": "Modern School",
            "code": "MS008",
            "address": "Barakhamba Road",
            "city": "Delhi",
            "state": "Delhi",
            "country": "India",
            "pincode": "110001",
            "phone": "+91-9811122233",
            "email": "modernschool@modern.edu.in",
            "principal_name": "Dr. Pankaj Khanna",
            "established_year": 1920,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "9",
            "name": "La Martiniere College",
            "code": "LMC009",
            "address": "Hazratganj",
            "city": "Lucknow",
            "state": "Uttar Pradesh",
            "country": "India",
            "pincode": "226001",
            "phone": "+91-9412345678",
            "email": "info@lamartiniere.org",
            "principal_name": "Brother Francis",
            "established_year": 1845,
            "type": "Private",
            "status": "Active"
        },
        {
            "id": "10",
            "name": "St. Xavier’s School",
            "code": "SXS010",
            "address": "Near Churchgate",
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "pincode": "400020",
            "phone": "+91-9871123456",
            "email": "stxaviersmumbai@edu.org",
            "principal_name": "Father Dominic",
            "established_year": 1869,
            "type": "Private",
            "status": "Active"
        }
    ];
  const { records =item, total: totalCount = 30 } = dataRecords || {};
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const allColumns = [
    { key: "id", label: "ID", order: 1, isActive: true },
    { key: "name", label: "School Name", order: 2, isActive: true },
    { key: "code", label: "Code", order: 3, isActive: true },
    { key: "principal_name", label: "Principal", order: 4, isActive: true },
    { key: "phone", label: "Phone", order: 5, isActive: true },
    { key: "email", label: "Email", order: 6, isActive: true },
    { key: "city", label: "City", order: 7, isActive: true },
    { key: "state", label: "State", order: 8, isActive: true },
    { key: "established_year", label: "Established", order: 9, isActive: true },
    { key: "type", label: "Type", order: 10, isActive: true },
    { key: "status", label: "Status", order: 11, isActive: true },
  ];

  const savedColumns = localStorage.getItem("selectedColumns");
  let userColumns: Column[] = savedColumns ? JSON.parse(savedColumns) : [];
  const mergedColumns = allColumns.map((defaultCol) => {
    const userCol = userColumns.find((col: Column) => col.key === defaultCol.key);
    return userCol ? { ...defaultCol, ...userCol } : defaultCol;
  });

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        allColumns={allColumns}
      />

      <div className="shadow-lg p-2">
        <Toolbar
          title="Leave Request"
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSearch={(query) => setFilter(query)}
          onRefresh={refetch}
          onAdd={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          onPreference={() => setIsSettingsOpen(true)}
          advancedSearch={() => setIsPreferencesOpen(!isPreferencesOpen)}
        />

        {isPreferencesOpen && (
          <AdvancedFilter isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)}>
            <div className="row">
              <InputFormField label="Name" name="name" inputValue="" error={""} required onChange={() => {}} />
              <InputFormField label="Code" name="code" inputValue="" error={""} required onChange={() => {}} />
            </div>
          </AdvancedFilter>
        )}

        <TableComponent
          setOpenSliderForm={setOpenForm}
          setFormData={setEditData}
          isFetching={isFetching}
          data={records}
          allColumns={mergedColumns}
          selectedIds={[]}
          setSelectedIds={() => {}}
          setSelectedItems={() => {}}
        />

        <AddEditForm open={openForm} onClose={() => setOpenForm(false)} initialData={editData} onSuccess={refetch} />

        {totalCount > itemsPerPage && (
          <PageNumber
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleFilter={() => {}}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  );
};

export default Index;
