import { StylesConfig } from 'react-select';

export const customSelectOption: StylesConfig = {
    control: (base, state) => ({
        ...base,
        height: 'calc(1em + .50rem + 2px)',
        minHeight: 'calc(1em + .50rem + 2px)',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0',
        minWidth: '40%',
        boxSizing: 'border-box',
        backgroundColor: state.isDisabled ? '#e9ecef' : '#6ee9a4',
        color: state.isDisabled ? '#6ee9a4' : 'black',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 9px',
        justifyContent: 'flex-start',
        height: '130%',
        boxSizing: 'border-box',
        minWidth: '40%',
        fontSize: '11px',
        fontWeight: 'bold',
    }),
    singleValue: (base) => ({
        ...base,
        minWidth: '80%',
        margin: '0',
        textAlign: 'left',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: '13px',
        alignItems: 'end',
        padding: '0',
        height: '40%',
        display: 'flex',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'black',
        fontSize: '5px',
        padding: '0px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    menu: (base) => ({
        ...base,
        fontSize: '11px',
        whiteSpace: 'nowrap',
        width: 'auto',
        minWidth: '80%',
        maxWidth: '250px',
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '13px',
        backgroundColor: state.isDisabled ? '#d3d3d3' : state.isSelected ? '#6ee9a4' : 'white',
        color: 'black',
    }),
    input: (base) => ({
        ...base,
        fontSize: '11px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 999999 }),
};


export const customSelectOption1: StylesConfig = {
    control: (base, state) => ({
        ...base,
        height: 'calc(2em + .50rem + 2px)',
        // minHeight: 'calc(1em + .50rem + 2px)',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0',
        minWidth: '80%',
        boxSizing: 'border-box',
        borderRadius:"0px",
        // backgroundColor: state.isDisabled ? '#e9ecef' : '#6ee9a4',
        color: state.isDisabled ? '#ecf5f0ff' : 'black',
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 9px',
        justifyContent: 'flex-start',
        // height: '130%',
        boxSizing: 'border-box',
        minWidth: '40%',
        fontSize: '11px',
        fontWeight: 'bold',
    }),
    singleValue: (base) => ({
        ...base,
        // minWidth: '%',
        margin: '0',
        textAlign: 'left',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: '13px',
        alignItems: 'end',
        padding: '0',
        height: '40%',
        display: 'flex',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'black',
        fontSize: '5px',
        padding: '0px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    menu: (base) => ({
        ...base,
        fontSize: '11px',
        whiteSpace: 'nowrap',
        width: 'auto',
        minWidth: '100%',
        maxWidth: '100%',
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '13px',
        backgroundColor: state.isDisabled ? '#d3d3d3' : state.isSelected ? '#6ee9a4' : 'white',
        color: 'black',
    }),
    input: (base) => ({
        ...base,
        fontSize: '11px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 999999 }),
};


export const SelectOption: StylesConfig = {
    ...customSelectOption,
    menuList: (provided) => ({
        ...provided,
        maxHeight: '110px',
        overflowY: 'auto',
    }),
};


export const rowSelectdOption: StylesConfig = {
    ...customSelectOption,
    menuList: (provided) => ({
        ...provided,
        maxHeight: '200px',
        overflowY: 'auto',
    }),
};

export interface Column {
    column_key: string;
    column_label: string;
    column_order: number;
    is_active: boolean;
    id: number;
  }

interface BadgeProps {
  text: string;
  color: string;
}

export type StatusValue = "Y" | "N";

export interface StatusOption {
  value: StatusValue;
  label: string;
}

export const isActiveOptions: StatusOption[] = [
  { value: "Y", label: "Active" },
  { value: "N", label: "In Active" },
];
export const getBadgeProps = (status: string): BadgeProps => {
  switch (status) {
    case "Y":
      return { text: "Active", color: "bg-success" };
    case "N":
      return { text: "In Active", color: "bg-danger" };
    case "T":
      return { text: "Terminated", color: "bg-warning" };
    default:
      return { text: "Unknown", color: "bg-secondary" };
  }
};

export const getDefault = (status: string): BadgeProps => {
  switch (status) {
    case "Y":
      return { text: "Yes", color: "bg-primary" };
    case "N":
      return { text: "No", color: "bg-danger" }; 
    default:
      return { text: "Unknown", color: "bg-secondary" };
  }
};

