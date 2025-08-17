

import React from "react";

const BredCrumbs: React.FC = () => {
    return (
        <nav aria-label="breadcrumb mt-5">
            <ol className="breadcrumb" style={{ marginBottom: 0 }}>
                <li className="breadcrumb-item">
                    <a href="/apps/BredCrumbs">Dashboard</a>
                </li>
                {/* <li className="breadcrumb-item">Security</li> */}
                <li className="breadcrumb-item">Overview</li>
                {/* <li className="breadcrumb-item active" aria-current="page">
                    Modify User Access Privileges
                </li> */}
            </ol>
        </nav>)
}
export default BredCrumbs;

// import routes from '@/router/routes';
// import { useMatches, Link } from 'react-router-dom';

// const Breadcrumbs = () => {
//   const matches = useMatches();

//   return (
//     <nav aria-label="breadcrumb">
//       <ol className="breadcrumb">
//         {routes.map((match, index) => (
//           <li
//             key={index}
//             className={`breadcrumb-item ${
//               index === matches.length - 1 ? 'active' : ''
//             }`}
//           >
//             {index === matches.length - 1 ? (
//               match.name
//             ) : (
//               <Link to={match.url}>{match.name}</Link>
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumbs;
