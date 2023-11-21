// Search.jsx
import React from 'react'

import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './styles.module.css' // Make sure the path is correct

type Props = {
  data: any
  children: any
}

// const FilterSidebar = () => {
//   return (
//     <>
//       <div className={styles['heading']}>
//         <h1>Search Results</h1>
//       </div>
//       <div className="filter-sidebar">
//         {/* Add filter components here */}
//         <h2>Filters</h2>
//         {/* Example Filter Items */}
//         <div className="filter-item">Hobbies</div>
//         <div className="filter-item">People pages</div>
//         {/* ... other filters */}
//       </div>
//     </>
//   )
// }

// const ExploreSidebar = () => {
//   return (
//     <div className="explore-sidebar">
//       {/* Add explore more components here */}
//       <h2>Explore More</h2>
//       {/* Example Explore Items */}
//       <div className="explore-item">Item 1</div>
//       <div className="explore-item">Item 2</div>
//       {/* ... other explore items */}
//     </div>
//   )
// }

// const MainContent = ({ data }) => {
//   return (
//     <main className="search-results">
//       <section className="hobbies-section">
//         <h2>Hobbies</h2>
//         {/* Replace this with your data mapping */}
//         {data.hobbies.map((hobby) => (
//           <div key={hobby.id} className="hobby-item">
//             {hobby.name}
//           </div>
//         ))}
//       </section>
//       <section className="people-pages-section">
//         <h2>People Pages</h2>
//         {/* Replace this with your data mapping */}
//         {data.people.map((person) => (
//           <div key={person.id} className="people-item">
//             {person.name}
//           </div>
//         ))}
//       </section>
//     </main>
//   )
// }
console.log()

const Search: React.FC<Props> = ({ data, children }) => {
  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <PageGridLayout column={3}>
      {/* <FilterSidebar /> */}
      {/* <MainContent data={data} /> */}
      {/* <ExploreSidebar /> */}
    </PageGridLayout>
  )
}

export default Search
