import { useRouter } from "next/router";

import { Toolbar } from "../../components/toolbar";

import styles from "../../styles/feed.module.css";

export const Feed = ({ pageid, articles }) => {
	const router = useRouter();
	return (
		<div className="page-container">
			<div className={styles.main}>
				<Toolbar />
				{articles.map((article, index) => (
					<div key={index} className={styles.post}>
						<h1
							onClick={() => (window.location.href = article.url)}
						>
							{article.title}
						</h1>
						<p>{article.description}</p>
						{!!article.urlToImage && (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={article.urlToImage} alt="article image" />
						)}
					</div>
				))}
			</div>
			<div className={styles.paginator}>
				<div
					onClick={() => {
						if (pageid > 1) {
							router.push(`/feed/${pageid - 1}`);
						}
					}}
					className={pageid === 1 ? styles.disabled : styles.active}
				>
					Previous
				</div>
				<div>#{pageid}</div>
				<div
					onClick={() => {
						if (pageid < 5) {
							router.push(`/feed/${pageid + 1}`);
						}
					}}
					className={pageid === 5 ? styles.disabled : styles.active}
				>
					Next
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async (pageContext) => {
	const pageid = pageContext.query.pageid;

	if (!pageid || pageid < 1 || pageid > 5) {
		return {
			props: {
				articles: [],
				pageid: 1,
			},
		};
	}

	const apiResponse = await fetch(
		`https://newsapi.org/v2/top-headlines?country=in&pageSize=5&page=${pageid}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEWS_KEY}`,
			},
		}
	);

	const apiJson = await apiResponse.json();
	const { articles } = apiJson;
	return {
		props: {
			articles,
			pageid: Number.parseInt(pageid),
		},
	};
};

export default Feed;
