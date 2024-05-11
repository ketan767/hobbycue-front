import Footer from '@/components/Footer/Footer'
import styles from './styles.module.css'
import Link from 'next/link'

export default function index() {
  return (<>
    <div className={styles.container}>
        <p><Link target="_blank" href={"http://blog.hobbycue.com/wp-admin/users.php?page=bp-profile-edit"}>Extended Profile</Link></p>
        <p><Link href={"/hobby"}>Explore Hobbies</Link></p>
        <h1>What can I do in <em>hobbycue</em>?</h1>
        <h2><Link target="_blank" href={"http://blog.hobbycue.com/cues"}>Read or Write Blogs</Link></h2>
        <p>Each hobby has its own community and category in <strong><em>hobbycue</em></strong>.  Blogs can contain Information, DIY (do it yourself) Instructions, Pictures and Videos.</p>
        <p><Link target="_blank" href={"http://blog.hobbycue.com/cues"}>View blogs</Link></p>
        <h2><Link target="_blank" href={"/"}>Find People, Products, Places</Link></h2>
        <p>Find local information on Teachers, Coaches, Guides, Materials, Equipment, Supplies, Venues, Workshops and Events related to your hobby.</p>
        <p><Link target="_blank" href={"/"}>Search Bangalore</Link></p>
        <h2><Link href={"/add-listing"}>Add a Listing</Link></h2>
        <p>Listing is an addition to <strong><em>hobbycue</em></strong> database of People, Products and Places. Anyone can Add a Listing. Owners can then claim it and update.</p>
        <p><Link target="_blank" href={"/"}>View Listings</Link></p>
        <h2>What next?</h2>
        <p>Go ahead and login using any of the Sign-in with social media links or using the Login or Register options. Once you are logged in, you can create your blog posts (click on the + icon at the top) or add a listing (under Listing menu). Check out the FAQ section under Home. Do you have any recommended content?  Let us know how we can help …</p>
        <p><Link target="_blank" href={"http://blog.hobbycue.com/survey"}>I’ve got Cues</Link></p>
    </div>
    <Footer/>
  </>)
}
