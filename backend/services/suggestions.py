def generate_suggestions(missing_skills):
    suggestions = []

    for skill in missing_skills:
        if skill == "machine learning":
            suggestions.append("Consider adding Machine Learning projects or certifications")
        elif skill == "node.js":
            suggestions.append("Build backend projects using Node.js and Express")
        elif skill == "react":
            suggestions.append("Create frontend projects using React")
        elif skill == "sql":
            suggestions.append("Practice database queries and add SQL projects")
        elif skill == "python":
            suggestions.append("Strengthen Python with real-world projects")
        else:
            suggestions.append(f"Try to include {skill} in your projects or skills section")

    return suggestions