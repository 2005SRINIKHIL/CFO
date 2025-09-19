import pathway.xpacks.llm.llms as llms

# List all attributes inside llms
print("All attributes in llms submodule:")
print(dir(llms))

# Filter capitalized names (likely classes)
classes = [name for name in dir(llms) if name[0].isupper()]
print("\nPossible LLM classes:")
print(classes)

# See file path
print("\nModule path:")
print(llms.__file__)
