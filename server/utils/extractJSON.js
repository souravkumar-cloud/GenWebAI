const extractJSON = (text) => {
    try {
        if (!text) return null

        const cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim()

        const start = cleaned.indexOf('{')
        const end = cleaned.lastIndexOf('}')

        if (start === -1 || end === -1) return null

        const jsonString = cleaned.slice(start, end + 1)

        return JSON.parse(jsonString)

    } catch (error) {
        console.log("❌ JSON PARSE ERROR:", error.message)
        return null
    }
}

export default extractJSON
