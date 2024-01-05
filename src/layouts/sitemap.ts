import { getAllUserUrls } from "@/services/user.service";

export default async function sitemap() {
    try {
        const { res, err } = await getAllUserUrls();

        if (err) {
            throw new Error("Error fetching user URLs");
        }

        const profileUrls = res?.data?.data?.profileUrls;
        console.log("profileUrls", profileUrls);

      

        const sitemapUrls = profileUrls.map((profileUrl:any) => ({
            urls: `/${profileUrl}`,
            lastModified: new Date(),
        }));

        return [
            {
                urls: '/',
                lastModified: new Date(),
            },
            ...sitemapUrls,
        ];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        throw error;
    }
}
