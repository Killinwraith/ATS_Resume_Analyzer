import streamlit as st
import api

def analyze():
    st.write("Analyzing...")
    response = api.healthCheck()
    st.write(response)


st.title("ATS Resume Analyzer")


left_column, right_column = st.columns(2)

with left_column:
    st.write("Upload a resume to analyze")
    resume = st.file_uploader("Upload a resume", type=["pdf", "docx"])

with right_column:
    st.write("Upload a job description to analyze")
    st.text_area("Job description", height=160)

if resume:
    st.write("Resume uploaded successfully")

st.button("Analyze", on_click=analyze())

