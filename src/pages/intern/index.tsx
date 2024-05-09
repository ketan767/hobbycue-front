import Link from 'next/link';
import styles from './styles.module.css';
import Footer from '@/components/Footer/Footer';

export default function index() {
  return (<>
    <div className={styles.container}>
        <div className={styles.dataSection}>
            <div className={styles.about}>
                <h1>Intern</h1>
                <p>hobbycue.com  is a comprehensive platform for supporting the pursuit one’s hobby.  It is a one stop shop to explore and progress ones creativity and talent in fields such as music, dance, arts, sports, games, cooking, gardening, technology, etc.  The platform is built by Purple Cues Pvt Ltd, a startup company that has been incubated by Government of Karnataka as part of NASSCOM 10K Startups program.  Purnima and Bhaskar are a couple who co-founded this.  Purnima has done her Masters in Computer Applications from Madras University, and Bhaskar is an alumnus of IIT Kanpur with over 20 years of experience in the IT industry.</p>
                <p>We are always on the lookout for enterprising individuals with strong skills in various fields shown below to work in an internship or returnship model.  This is an excellent opportunity to learn more about the Hobby Industry, Online Marketplace, eCommerce, Research, Marketing Content, Campaigns, Engaging Visuals, and much more.  You will be working directly with the co-founders on this, and can learn more about the start-up business.  You can work from home, at your preferred timings, with well-defined scope and schedule, and gain certified experience.</p>
                <p>If you think you are the right fit, write to <Link href={"mailto:info@hobbycue.com"}>info@hobbycue.com</Link></p>
                <p><span className='font-semibold'>Content Writing</span> : Strong content skills to collate and curate information about teachers, classes, equipment sellers, renters and practice spaces pertaining to a hobby.  This involves internet search and may also involve site visits depending on the scope</p>
                <p><span className='font-semibold'>Content Marketing</span> : Intriguing page write-ups, blogs, videos and social media posts on topics such as benefits of hobbies, beginner’s guide, progressing a hobby, etc.</p>
                <p><span className='font-semibold'>Scripting Automation</span> : Strong technical skills to create scripts to fetch internet data to collate and curate information about teachers, classes, equipment sellers, renters and practice spaces pertaining to a hobby.</p>
                <p><span className='font-semibold'>Market Research</span> : Research on the market potential by hobby, genre, region, age-group and other demographics.  Research on market gaps, competition and benchmarks.</p>
                <p><span className='font-semibold'>Online Marketing</span> : Expertise in Google (AdSense, AdWords, Analytics), and Facebook marketing to independently setup, analyse, and fine tune marketing campaigns.</p>
                <p><span className='font-semibold'>WordPress</span> : Strong skills on WordPress and related technologies to quickly upgrade the website features.  Features on the list include User Profile (like LinkedIn, Instagram), Community Features (like Facebook, Meetup), Directory Listing (like Yelp, FourSquare) and eCommerce features for Products (Amazon), Services (UrbanClap) and Events (BookMyShow).  While having an overall vision in mind, the preference is to execute updates in an agile model with well-defined scope, schedule and costs for each feature or sprint.</p>
                <h2>Benefits  to Interns</h2>
                <ul>
                    <li>Understand the Hobby Classification and Industry details</li>
                    <li> Understand the business models of Community, Marketplace, and eCommerce</li>
                    <li>Learn how to do effective Google search and unearth information</li>
                    <li>Learn how to do effective Research and Curate Information from multiple sources</li>
                    <li>Learn how to write effective content for Readability and Searchability</li>
                    <li>Learn more about SEO (Search Engine Optimisation) and Inbound Marketing</li>
                </ul>
                <p>If you think you are the right fit, write to info@hobbycue.com</p>
                <p>If you are already interning with us, find your key information here :</p>
                <Link target="_blank" href={'http://blog.hobbycue.com/intern-links'}>http://blog.hobbycue.com/intern-links</Link>
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
            </div>
        </div>
    </div>
    <Footer/>
  </>)
}
