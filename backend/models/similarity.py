from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(resume_text, jd_text):
    # create vectorizer
    vectorizer = TfidfVectorizer()

    # combine texts
    texts = [resume_text, jd_text]

    # convert to vectors
    tfidf_matrix = vectorizer.fit_transform(texts)

    # compute similarity
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

    return round(float(similarity[0][0]) * 100, 2)