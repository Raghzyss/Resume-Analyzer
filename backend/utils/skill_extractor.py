def extract_skills(text):
    skill_map = {
        "python": ["python"],
        "java": ["java"],
        "c++": ["c++"],
        "c": ["c"],
        "sql": ["sql"],
        "html": ["html"],
        "css": ["css"],
        "javascript": ["javascript", "js"],
        "react": ["react"],
        "node.js": ["node.js", "node js", "nodejs"],
        "express": ["express"],
        "mongodb": ["mongodb"],
        "machine learning": ["machine learning", "ml"],
        "deep learning": ["deep learning", "dl"],
        "nlp": ["nlp"],
        "data analysis": ["data analysis", "data analytics"],
        "tensorflow": ["tensorflow"],
        "pandas": ["pandas"]
    }

    found_skills = []

    for main_skill, variations in skill_map.items():
        for variant in variations:
            if variant in text:
                found_skills.append(main_skill)
                break

    return list(set(found_skills))