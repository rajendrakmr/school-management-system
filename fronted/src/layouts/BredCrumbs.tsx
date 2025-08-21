import { useSelector } from "react-redux";
import { RootState } from "@/store";
interface BreadcrumbProps {
    title: string;
    sub_title?: string;
}

const Breadcrumbs: React.FC = () => {

    const crumbs = useSelector((state: RootState) => state?.breadcrumb?.crumbs);
    return (
        <div className="breadcrumbs d-flex align-items-center ms-1">
            <span className="breadcrumb-item">
               <a href="/apps/dashboard" className="px-2">Dashboard</a>
                | {crumbs?.map((crumb, idx) => (
                    <li key={idx} className="breadcrumb-item px-2">
                        {crumb}
                    </li>
                ))}</span>
        </div>

    );
};

export default Breadcrumbs;
