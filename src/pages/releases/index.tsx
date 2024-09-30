import Link from 'next/link';
import styles from './styles.module.css';
import Footer from '@/components/Footer/Footer';
import Head from 'next/head';

export default function index() {
  return (<>
    <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Releases</title>
    </Head>
    <div className={styles.container}>
        <div className={styles.dataSection}>
            <div className={styles.about}>
                <h1>Releases</h1>
                <ul>
                    <li>2024-05-04 Release 0.9.0</li>
                    <li style={{marginLeft:'10px'}}>This is the Beta release – May the 4th be with you!</li>
                    <li>2025-05-21 Release 0.9.1</li>
                </ul>
                <ul style={{marginLeft:'10px'}}>
                <li>Install mini web app on mobile phones</li>
                <li>Delete posts</li>
                <li>Site Admin ability to handle spam</li>
                <li>Add to mine for hobbies</li>
                <li>Bug fixes, image compression and data handling</li>
                <li style={{marginLeft:'-10px'}}>2025-06-07 Releases 0.9.1a to 0.9.1c</li>
                <li>Custom Page Button</li>
                <li>Event Registrations with Variants</li>
                <li>Admin Reports </li>
                <li>Create Post </li>
                <li>Bug fixes, share previews </li>
                <li style={{marginLeft:'-10px'}}>2025-06-21 Release 0.9.2</li>
                <li>Admin approval workflows </li> 
                <li>Facebook Login New </li> 
                <li>Transfer Page </li> 
                <li>Schedule with Weekdays </li> 
                <li>Everyone can add Events </li> 
                <li>Sign-in to view Contact </li>
                </ul>
            </div>
            <div className={styles.allPosts}>
                <h2>Blog Posts by Category</h2>
                <select
                onChange={(e)=>{
                    if(e.target.value==='Select Category'||e.target.value===undefined){return}else{
                        window.location.href=e.target.value
                    }
                }}
                >
	                <option value={undefined}>Select Category</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/activity/">Activity&nbsp;&nbsp;(26)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/activity/fitness">&nbsp;&nbsp;&nbsp;Fitness&nbsp;&nbsp;(2)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/activity/nature">&nbsp;&nbsp;&nbsp;Nature&nbsp;&nbsp;(11)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/activity/travel">&nbsp;&nbsp;&nbsp;Travel&nbsp;&nbsp;(20)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/activity/wellness">&nbsp;&nbsp;&nbsp;Wellness&nbsp;&nbsp;(4)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/arts/">Arts&nbsp;&nbsp;(26)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/artwork">&nbsp;&nbsp;&nbsp;Artwork&nbsp;&nbsp;(3)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/dance">&nbsp;&nbsp;&nbsp;Dance&nbsp;&nbsp;(4)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/literary">&nbsp;&nbsp;&nbsp;Literary&nbsp;&nbsp;(5)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/music">&nbsp;&nbsp;&nbsp;Music&nbsp;&nbsp;(9)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/photography">&nbsp;&nbsp;&nbsp;Photography&nbsp;&nbsp;(4)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/theatre">&nbsp;&nbsp;&nbsp;Theatre&nbsp;&nbsp;(2)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/arts/visual">&nbsp;&nbsp;&nbsp;Visual&nbsp;&nbsp;(2)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/collect/">Collect&nbsp;&nbsp;(8)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/collect-items/">&nbsp;&nbsp;&nbsp;Collect Items&nbsp;&nbsp;(1)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/making/">Making&nbsp;&nbsp;(14)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/making/cooking">&nbsp;&nbsp;&nbsp;Cooking&nbsp;&nbsp;(2)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/making/gardening">&nbsp;&nbsp;&nbsp;Gardening&nbsp;&nbsp;(4)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/making/utility">&nbsp;&nbsp;&nbsp;Utility&nbsp;&nbsp;(4)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/other/">Other&nbsp;&nbsp;(8)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/perform/">Perform&nbsp;&nbsp;(2)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/play/">Play&nbsp;&nbsp;(3)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/play/games">&nbsp;&nbsp;&nbsp;Games&nbsp;&nbsp;(1)</option>
	                <option className="level-1" value="https://blog.hobbycue.com/blog/category/play/sports">&nbsp;&nbsp;&nbsp;Sports&nbsp;&nbsp;(3)</option>
	                <option className="level-0" value="https://blog.hobbycue.com/blog/category/uncategorized/">Uncategorized&nbsp;&nbsp;(13)</option>
                </select>
                <h2 className={styles.mt40}>1 minute Intro</h2>
                <iframe id="video-2866-1_youtube_iframe" frameBorder="0" allowFullScreen={undefined} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" title="HobbyCue - 1 Minute Intro" src="https://www.youtube.com/embed/jd7DWl7woyw?controls=0&amp;rel=0&amp;disablekb=1&amp;showinfo=0&amp;modestbranding=0&amp;html5=1&amp;iv_load_policy=3&amp;autoplay=0&amp;end=0&amp;loop=0&amp;playsinline=0&amp;start=0&amp;nocookie=false&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fblog.hobbycue.com&amp;widgetid=1" width="272.5" height="153.28125"></iframe>
                <h2 className={styles.mt40}>Recent Posts</h2>
                <Link target="_blank" href={"https://blog.hobbycue.com/blog/the-4-ps-of-a-hobby/"}>The 4 Ps of a Hobby</Link>
                <Link target="_blank" href={"https://blog.hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/"}>What is it like to be an artreprenuer?</Link>
                <Link target="_blank" href={"https://blog.hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/"}>Plan your travel and tours on your own…</Link>
                <Link target="_blank" href={"https://blog.hobbycue.com/blog/ponniyin-selvan-characters/"}>Ponniyin Selvan main characters (and movie cast)</Link>
                <Link target="_blank" href={"https://blog.hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/"}>Balance in Life for Holistic Wellness & Development</Link>
                <div className={styles.myLinks}>
                    <Link target="_blank" href={"https://blog.hobbycue.com/dashboard/"}>Home</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/members/me/profile/edit"}>My Profile</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/community/"}>My Community</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/my-account/my-listings/"}>My Listings</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/my-account/edit-account"}>My Account</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/wp-admin/edit.php"}>My Blog Posts</Link>
                    <Link target="_blank" href={"https://blog.hobbycue.com/shop/"}>Store</Link>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
  </>)
}
