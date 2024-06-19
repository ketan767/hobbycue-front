import Link from 'next/link';
import styles from './styles.module.css';
import Footer from '@/components/Footer/Footer';

export default function index() {
  return (<>
    <div className={styles.container}>
        <div className={styles.dataSection}>
            <div className={styles.about}>
                <h1>Intern</h1>
                <p>Howdy !</p>
                <p>Here you’ll find all the quick tips combined and updated</p>
                
                <ul>
                    <li>Always login to see all accessible menu options on hobbycue.com</li>
                    <li>Keep checking this page for updates and use it for daily updates</li>
                </ul>
                <h4><strong>Adding Listing Content:</strong></h4>
                <ul>
                    <li>To access Listings you have added …
                    </li>
                    <li style={{marginLeft:'10px'}}>Your Profile Pic / Name (top right) =&gt; My Listings</li>
                    <li>Ideal size of Content / Description is 100 to 200 words.</li>
                </ul>
                <ul style={{marginLeft:'10px'}}>
                    <li>Focus on the following: <br />1) Info about guru(s) from whom they learned. <br />
                    2) Top performances, awards and contribution. <br />
                    3) Key students, school, teaching related info.</li>
                    <li>Readability and SEO scores and comments (scroll down on back-end editor)</li>
                    <li>Follow consistent spelling of Indian words.  For keywords use the first Wikipedia spelling.</li>
                    <li>Never include a space before a comma or full-stop.  Always include a space after a comma or full-stop.  This applies everywhere: title, description, address, multiple phone numbers</li>
                    <li>Do not include a full-stop after initials.  Eg: “D K Pattammal” instead of “D. K. Pattammal”</li>
                    <li style={{marginLeft:'-10px'}}>For images, follow the following:</li>
                    <li>Get Square Profile Pic, Long Cover Image, and 4:3 ratio on Other Gallery Pics.</li>
                    <li>For a Person, the Profile Pic could be a close-up of face.  For a Place, the Profile Pic could be a close-up of brand name or logo. The Cover Image could ideally be a stage performance and/or pic of class or students.</li>
                    <li>PNG is preferred file type. If not, use JPG.  Optimise to a file size of 300K.</li>
                    <li>Rename the image files to contain the Listing name and keywords followed by a number if needed.
                    eg: “Meena-Murthy-Carnatic.png” or “Meena-Murthy-Veena-1.png”.  Here, the keyword Carnatic or Veena is added, because a Google search on just “Meena Murthy” goes to a different profile.</li>
                    <li style={{marginLeft:'-10px'}}>Other sections:</li>
                    <li>In the Video URL, add only an individual video link so that it can play.  If you want to add a link to a YouTube channel, do so under the Social Media link section.</li>
                    <li>If you are adding a Social Media link or taking a photo from there, please ensure that it is primarily a professional one and not a personal profile photo (eg: mostly with family and friends).</li>
                    <li>Capture referenced and useful links in the Notes section of the Listing.</li>
                    <br /><hr /><br /></ul>
                    <div style={{width:'100%'}}>
                    <h4><strong>Log your Daily Work here:</strong></h4>
                    <p>Your Name*</p>
                    <input type="text" />
                    <br />
                    <p>Your Email*</p>
                    <input type="text" />
                    <br />
                    <p>Work Date*</p>
                    <input type="date" />
                    <br />
                    <p>Work Hours*</p>
                    <input type="number" />
                    <br />
                    <p>Notes on Work Done</p>
                    <textarea placeholder='What was interesting?  What did you learn?  How did this benefit?  (Check the Benefits section of http://hobbycue.com/intern).  What can be done better by you or by hobbycue founders?'></textarea>
                    <br />
                    <button className={styles['sendBtn']}>Send</button>
                    <br />
                    <br />
                    <p>Let us know if something is missing and we’ll add.  <a target="_blank" href="mailto:info@hobbycue.com">mailto:info@hobbycue.com</a></p>
                </div>
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
