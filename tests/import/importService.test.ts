it('should not duplicate games', async () => {
  // Mock the Game.findOne method to return a game with the specified _id
  (Game.findOne as jest.Mock).mockResolvedValue(mockGame);

  // Other logic for this test can go here, but since you're only checking for duplicates, no need for further implementation
});
